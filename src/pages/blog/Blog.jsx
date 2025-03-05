import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Input, Spin, Typography } from 'antd';
import { Link } from 'react-router-dom';
import blogApi from '../services/api.blog';
import moment from 'moment';

const { Search } = Input;
const { Title } = Typography;

const Blog = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Fetch blogs from API
    const fetchBlogs = async () => {
        try {
            const data = await blogApi.getAllPosts();
            setBlogs(data);
        } catch (error) {
            console.error('Error fetching blogs:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, []);

    // Filter blogs based on search term
    const filteredBlogs = blogs.filter(blog => 
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <Title level={2} className="mb-6">Blog</Title>
            <Search
                placeholder="Tìm kiếm bài viết..."
                allowClear
                onChange={e => setSearchTerm(e.target.value)}
                style={{ width: 300, marginBottom: '20px' }}
            />

            {loading ? (
                <div className="text-center py-8">
                    <Spin size="large" />
                </div>
            ) : (
                <Row gutter={[24, 24]}>
                    {filteredBlogs.length > 0 ? (
                        filteredBlogs.map(blog => (
                            <Col xs={24} sm={12} lg={8} key={blog.id}>
                                <Link to={`/blog/${blog.id}`}>
                                    <Card hoverable className="h-full">
                                        <Card.Meta
                                            title={blog.title}
                                            description={
                                                <div>
                                                    <div className="text-sm text-gray-500 mb-2">
                                                        {moment(blog.createdAt).format('DD/MM/YYYY HH:mm')}
                                                    </div>
                                                    <div className="line-clamp-3 text-gray-600">
                                                        {blog.content.replace(/<[^>]+>/g, '')}
                                                    </div>
                                                </div>
                                            }
                                        />
                                    </Card>
                                </Link>
                            </Col>
                        ))
                    ) : (
                        <Col span={24}>
                            <div className="text-center">Không tìm thấy bài viết nào.</div>
                        </Col>
                    )}
                </Row>
            )}
        </div>
    );
};

export default Blog; 