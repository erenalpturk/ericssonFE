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
import { Card, Row, Col, Statistic, Spin } from 'antd';

interface StatsData {
  general: {
    stockDistribution: {
      available: number;
      sold: number;
      reserved: number;
    };
  };
  activations: {
    total: number;
    byType: Record<string, number>;
    byTariff: Record<string, number>;
    byStatus: Record<string, number>;
    timeBased: {
      last24Hours: number;
      last7Days: number;
      last30Days: number;
    };
  };
  users: {
    total: number;
    topUsers: Record<string, number>;
  };
  trends: {
    hourlyDistribution: Record<string, number>;
    dailyTrend: Record<string, number>;
    averageDailyActivations: number;
    peakHour: {
      hour: string;
      count: number;
    };
  };
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const Stats: React.FC = () => {
  const [statsData, setStatsData] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/iccid/getstats');
        setStatsData(response.data);
      } catch (error) {
        console.error('İstatistikler yüklenirken hata oluştu:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

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

  return (
    <div style={{ padding: '24px' }}>
      <h1>İstatistik Paneli</h1>

      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Toplam Aktivasyon"
              value={statsData.activations.total}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Son 24 Saat"
              value={statsData.activations.timeBased.last24Hours}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Toplam Kullanıcı"
              value={statsData.users.total}
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
    </div>
  );
};

export default Stats; 