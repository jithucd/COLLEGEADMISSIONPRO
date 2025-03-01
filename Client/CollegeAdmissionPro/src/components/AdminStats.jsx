const AdminStats = () => {
    const [stats, setStats] = useState(null);
  
    useEffect(() => {
      const fetchStats = async () => {
        const data = await getAdminStats();
        setStats(data);
      };
      fetchStats();
    }, []);
  
    return (
      <Row className="g-4">
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Total Users</Card.Title>
              <Card.Text>{stats?.totalUsers || 0}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        {/* Add more stat cards */}
      </Row>
    );
  };

  export default AdminStats;