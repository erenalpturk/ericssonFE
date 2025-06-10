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
import { Card, Row, Col, Statistic, Spin, Table } from 'antd';
import { useAuth } from '../contexts/AuthContext';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const Stats = () => {
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { baseUrl } = useAuth();

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

  // Stok dağılımı için veri hazırlama
  const stockData = [
    { name: 'Mevcut', value: statsData.general.stockDistribution.available },
    { name: 'Satılan', value: statsData.general.stockDistribution.sold },
    { name: 'Rezerve', value: statsData.general.stockDistribution.reserved },
  ];

  // Aktivasyon tipleri için veri hazırlama
  const activationTypeData = Object.entries(statsData.activations.byType).map(([name, value]) => ({
    name,
    value,
  }));

  // Tarife bazlı aktivasyonlar için veri hazırlama
  const tariffData = Object.entries(statsData.activations.byTariff).map(([name, value]) => ({
    name,
    value,
  }));

  // Durum bazlı aktivasyonlar için veri hazırlama
  const statusData = Object.entries(statsData.activations.byStatus).map(([name, value]) => ({
    name,
    value,
  }));

  // Saatlik dağılım için veri hazırlama
  const hourlyData = Object.entries(statsData.trends.hourlyDistribution).map(([hour, count]) => ({
    hour: `${hour}:00`,
    count,
  }));

  // Günlük trend için veri hazırlama
  const dailyTrendData = Object.entries(statsData.trends.dailyTrend)
    .map(([date, count]) => ({
      date,
      count,
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Kullanıcı bazlı aktivasyonlar için tablo kolonları
  const userColumns = [
    {
      title: 'Kullanıcı',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Toplam',
      dataIndex: 'total',
      key: 'total',
      sorter: (a, b) => a.total - b.total,
    },
    {
      title: 'Son 24 Saat',
      dataIndex: 'last24Hours',
      key: 'last24Hours',
      sorter: (a, b) => a.last24Hours - b.last24Hours,
    },
    {
      title: 'Son 7 Gün',
      dataIndex: 'last7Days',
      key: 'last7Days',
      sorter: (a, b) => a.last7Days - b.last7Days,
    },
    {
      title: 'Son 30 Gün',
      dataIndex: 'last30Days',
      key: 'last30Days',
      sorter: (a, b) => a.last30Days - b.last30Days,
    },
  ];

  // Kullanıcı bazlı aktivasyonlar için veri hazırlama
  const userData = Object.entries(statsData.users.detailedStats).map(([id, data]) => ({
    key: id,
    name: data.fullName,
    total: data.total,
    last24Hours: data.last24Hours,
    last7Days: data.last7Days,
    last30Days: data.last30Days,
  }));

  return (
    <div style={{ padding: '24px' }}>
      <h1>İstatistik Paneli</h1>

      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Toplam Aktivasyon"
              value={statsData.activations.total}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Son 24 Saat"
              value={statsData.activations.timeBased.last24Hours}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Son 7 Gün"
              value={statsData.activations.timeBased.last7Days}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Son 30 Gün"
              value={statsData.activations.timeBased.last30Days}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
        <Col span={12}>
          <Card title="Stok Dağılımı">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stockData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {stockData.map((entry, index) => (
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
          <Card title="Aktivasyon Tipleri">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={activationTypeData}>
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
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
        <Col span={12}>
          <Card title="Tarife Bazlı Aktivasyonlar">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={tariffData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {tariffData.map((entry, index) => (
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
        <Col span={24}>
          <Card title="Saatlik Aktivasyon Dağılımı">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
        <Col span={24}>
          <Card title="Günlük Aktivasyon Trendi">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyTrendData}>
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
          <Card title="Kullanıcı Bazlı Aktivasyonlar">
            <Table
              columns={userColumns}
              dataSource={userData}
              pagination={{ pageSize: 10 }}
              scroll={{ x: true }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Stats; 