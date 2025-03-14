import React, { useState, useEffect } from 'react';

import { useParams, useNavigate } from 'react-router-dom';

import { Card, Spin, Button } from 'antd';

import { ArrowLeftOutlined } from '@ant-design/icons';

import blogApi from '../services/api.blog';

import moment from 'moment';



const BlogDetail = () => {

    const { id } = useParams();

    const navigate = useNavigate();

    const [blog, setBlog] = useState(null);

    const [loading, setLoading] = useState(true);



    useEffect(() => {

        const fetchBlogDetail = async () => {

            try {

                const data = await blogApi.getPostById(id);

                setBlog(data);

            } catch (error) {

                console.error('Error fetching blog detail:', error);

            } finally {

                setLoading(false);

            }

        };



        fetchBlogDetail();

    }, [id]);



    if (loading) {

        return (

            <div className="text-center py-8">

                <Spin size="large" />

            </div>

        );

    }



    return (

        <div className="p-6 max-w-4xl mx-auto">

            <Button 

                icon={<ArrowLeftOutlined />} 

                onClick={() => navigate('/blog')}

                className="mb-4"

            >

                Quay lại

            </Button>



            {blog && (

                <Card className="shadow-md">

                    <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>

                    <div className="text-gray-500 mb-6">

                        Đăng ngày: {moment(blog.createdAt).format('DD/MM/YYYY HH:mm')}

                    </div>

                    <div 

                        className="prose max-w-none"

                        dangerouslySetInnerHTML={{ __html: blog.content }}

                    />

                </Card>

            )}

        </div>

    );

};



export default BlogDetail; 
