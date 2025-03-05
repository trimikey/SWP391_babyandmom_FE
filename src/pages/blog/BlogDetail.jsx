import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Spin, Button, message } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import moment from 'moment';
import api from '../../config/axios';
import backgroundImage from '../../assets/background.jpg';

const BlogDetail = () => {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    fetchBlogDetail();
  }, [id]);

  const fetchBlogDetail = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await api.get(`/blogs/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Blog data:', response.data);
      setBlog(response.data);
    } catch (error) {
      console.error('Error fetching blog detail:', error);
      if (error.response?.status === 403) {
        message.error('Bạn không có quyền truy cập bài viết này');
      } else {
        message.error('Không thể tải nội dung bài viết');
      }
    } finally {
      setLoading(false);
    }
  };

  console.log('Current blog state:', blog);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (!blog) {
    return (


      <div className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${backgroundImage})` }}>       
       <p className="text-gray-600 mb-4">Không tìm thấy bài viết</p>
        <Link to="/blog">
          <Button type="primary" icon={<ArrowLeftOutlined />}>
            Quay lại
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <Link to="/blog" className="inline-flex items-center text-pink-600 hover:text-pink-700 mb-6">
          <ArrowLeftOutlined className="mr-2" />
          Quay lại danh sách
        </Link>

        {/* Blog content */}
        <article className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {blog?.title || 'Không có tiêu đề'}
            </h1>
            <div className="flex items-center text-gray-500 text-sm">
              <span className="mr-4">
                {moment(blog?.createdAt).format('DD/MM/YYYY HH:mm')}
              </span>
              {blog?.author && (
                <span>
                  Tác giả: {blog.author}
                </span>
              )}
            </div>
          </div>

          {/* Main content */}
          <div className="p-6">
            {blog?.content ? (
              <div 
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />
            ) : (
              <p className="text-gray-600">Không có nội dung</p>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 bg-gray-50 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                Cập nhật lần cuối: {moment(blog?.updatedAt).format('DD/MM/YYYY HH:mm')}
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default BlogDetail; 