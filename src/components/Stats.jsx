import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ResponsiveContainer
} from 'recharts';
import axios from 'axios';
import { Card, Row, Col, Statistic, Spin, Table, Tag } from 'antd';
import { useAuth } from '../contexts/AuthContext';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#FF6B6B', '#4ECDC4'];

const Stats = () => {
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { baseUrl } = useAuth();
  const [datePage, setDatePage] = useState(1);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`${baseUrl}/iccid/getstats`);
        setStatsData(response.data);
      } catch (error) {
        console.error('İstatistikler yüklenirken hata oluştu:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [baseUrl]);

  if (loading) {
    return <Spin size="large" />;
  }

  if (!statsData) {
    return <div>Veri yüklenemedi</div>;
  }

  // Aktivasyon tipleri için veri hazırlama
  const activationTypeData = Object.entries(statsData.activations.byType).map(([name, value]) => ({
    name,
    value,
  }));

  // Durum bazlı aktivasyonlar için veri hazırlama
  const statusData = Object.entries(statsData.activations.byStatus).map(([name, value]) => ({
    name,
    value,
  }));

  // Ürün bazlı aktivasyonlar için veri hazırlama
  const productData = Object.entries(statsData.activations.byProduct).map(([name, value]) => ({
    name,
    value,
  }));

  // Günlük trend için veri hazırlama
  const dailyTrendData = Object.entries(statsData.activations.byDay)
    .map(([date, count]) => ({
      date,
      count,
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Kullanıcı bazlı aktivasyonlar için tablo kolonları
  const userColumns = [
    {
      title: 'Kullanıcı ID',
      dataIndex: 'userId',
      key: 'userId',
    },
    {
      title: 'Toplam Aktivasyon',
      dataIndex: 'total',
      key: 'total',
      sorter: (a, b) => a.total - b.total,
    },
  ];

  // Kullanıcı bazlı aktivasyonlar için veri hazırlama
  const userData = Object.entries(statsData.activations.byUser).map(([userId, total]) => ({
    key: userId,
    userId,
    total,
  }));

  // Ürün ve aktivasyon tipi bazlı detaylı tablo için kolonlar
  const productTypeColumns = [
    {
      title: 'Ürün ID',
      dataIndex: 'productId',
      key: 'productId',
    },
    {
      title: 'Aktivasyon Tipi',
      dataIndex: 'activationType',
      key: 'activationType',
    },
    {
      title: 'Aktivasyon Sayısı',
      dataIndex: 'count',
      key: 'count',
      sorter: (a, b) => a.count - b.count,
    },
    {
      title: 'Kullanıcılar',
      dataIndex: 'users',
      key: 'users',
      render: (users) => (
        <div>
          {users.map((user, index) => (
            <Tag key={index} color={COLORS[index % COLORS.length]}>
              {user}
            </Tag>
          ))}
        </div>
      ),
    },
  ];

  // Ürün ve aktivasyon tipi bazlı detaylı tablo için veri hazırlama
  const productTypeData = Object.entries(statsData.activations.byProdType).flatMap(([productId, types]) =>
    Object.entries(types).map(([type, data]) => ({
      key: `${productId}-${type}`,
      productId,
      activationType: type,
      count: data.count,
      users: data.users,
    }))
  );

  // Kullanıcı adlarını eşleştirmek için bir mapping varsa ekleyin, yoksa sadece userId gösterilecek
  const userIdToName = {
    // '123': 'Admin',
    // '15107684': 'Nafiye Buse Köken',
    // ...
  };

  // Pivot tablo için: satırlar kullanıcılar, kolonlar tarihler olacak
  const allDates = Object.keys(statsData.activations.byUserDay).sort((a, b) => new Date(b) - new Date(a));
  const allUsers = Array.from(
    new Set(
      Object.values(statsData.activations.byUserDay).flatMap(users => Object.keys(users))
    )
  );

  // Sayfalama için sabitler
  const datesPerPage = 7;
  const totalDatePages = Math.ceil(allDates.length / datesPerPage);
  const pagedDates = allDates.slice((datePage - 1) * datesPerPage, datePage * datesPerPage);

  // Son 7 gün ve son 30 gün tarihlerini bul
  const today = allDates.length > 0 ? new Date(allDates[0]) : new Date();
  const getDateNDaysAgo = (n) => {
    const d = new Date(today);
    d.setDate(d.getDate() - n + 1);
    return d;
  };
  const last7Days = allDates.filter(date => new Date(date) >= getDateNDaysAgo(7));
  const last30Days = allDates.filter(date => new Date(date) >= getDateNDaysAgo(30));

  // Tablo kolonları: ilk kolon kullanıcı, sonra toplam, haftalık, aylık, sonra sadece seçili tarihler
  const pivotColumns = [
    {
      title: 'Kullanıcı',
      dataIndex: 'userId',
      key: 'userId',
      fixed: 'left',
      render: (userId) => userIdToName[userId] || userId,
    },
    {
      title: 'Toplam',
      dataIndex: 'total',
      key: 'total',
      align: 'center',
      sorter: (a, b) => a.total - b.total,
    },
    {
      title: 'Son 7 Gün',
      dataIndex: 'last7',
      key: 'last7',
      align: 'center',
      sorter: (a, b) => a.last7 - b.last7,
    },
    {
      title: 'Son 30 Gün',
      dataIndex: 'last30',
      key: 'last30',
      align: 'center',
      sorter: (a, b) => a.last30 - b.last30,
    },
    ...pagedDates.map(date => ({
      title: date,
      dataIndex: date,
      key: date,
      align: 'center',
      sorter: (a, b) => (a[date] || 0) - (b[date] || 0),
    })),
  ];

  // Tablo verisi: her satır bir kullanıcı, her hücre ilgili gün ve kullanıcıya ait aktivasyon sayısı (yoksa 0)
  const pivotData = allUsers.map(userId => {
    const row = { userId, key: userId };
    let total = 0;
    let last7 = 0;
    let last30 = 0;
    allDates.forEach(date => {
      const val = statsData.activations.byUserDay[date]?.[userId] || 0;
      row[date] = val;
      total += val;
      if (last7Days.includes(date)) last7 += val;
      if (last30Days.includes(date)) last30 += val;
    });
    row.total = total;
    row.last7 = last7;
    row.last30 = last30;
    return row;
  });

  // Son 30 günlük günlük aktivasyonlar için veri hazırlama
  const last30DaysData = dailyTrendData.slice(-30);

  return (
    <div style={{ padding: '24px' }}>
      <h1>İstatistik Paneli</h1>

      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Toplam Aktivasyon"
              value={statsData.totalActivations}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Son 30 Gün Ortalama (Günlük)"
              value={
                statsData.activations.averageDailyLast30Days !== undefined && statsData.activations.averageDailyLast30Days !== null
                  ? Number(statsData.activations.averageDailyLast30Days).toFixed(2)
                  : '-'
              }
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Son 30 Gün Ortalama (Haftalık)"
              value={
                statsData.activations.averageWeeklyLast30Days !== undefined && statsData.activations.averageWeeklyLast30Days !== null
                  ? Number(statsData.activations.averageWeeklyLast30Days).toFixed(2)
                  : '-'
              }
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
        <Col span={12}>
          <Card title="Aktivasyon Tipleri">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={activationTypeData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {activationTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Durum Bazlı Aktivasyonlar">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
        <Col span={12}>
          <Card title="Ürün Bazlı Aktivasyonlar">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={productData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Son 30 Günlük Aktivasyon Trendi">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={last30DaysData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
        <Col span={24}>
          <Card title="Ürün ve Aktivasyon Tipi Bazlı Detaylar">
            <Table
              columns={productTypeColumns}
              dataSource={productTypeData}
              pagination={{ pageSize: 10 }}
              scroll={{ x: true }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
        <Col span={24}>
          <Card title="Günlük Kullanıcı Aktivasyonları">
            <div style={{ marginBottom: 16, textAlign: 'right' }}>
              <span>Gün Sayfası: </span>
              <button onClick={() => setDatePage(p => Math.max(1, p - 1))} disabled={datePage === 1}>Önceki</button>
              <span style={{ margin: '0 8px' }}>{datePage} / {totalDatePages}</span>
              <button onClick={() => setDatePage(p => Math.min(totalDatePages, p + 1))} disabled={datePage === totalDatePages}>Sonraki</button>
            </div>
            <Table
              columns={pivotColumns}
              dataSource={pivotData}
              pagination={false}
              scroll={{ x: true }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Stats; 