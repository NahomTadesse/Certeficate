"use client";
import { useState, useEffect } from 'react';
import {
  TextInput,
  Select,
  Button,
  Group,
  Container,
  Title,
  Notification,
  Grid,
  Loader,
  FileInput,
  Avatar,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import '@mantine/dates/styles.css';
import 'dayjs/locale/am';
import Cookies from 'js-cookie';

export default function ChurchFatherRegistration() {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [birthDate, setBirthDate] = useState(null);
  const [selectedChurch, setSelectedChurch] = useState('');
  const [idPhoto, setIdPhoto] = useState(null);
  const [previewImage, setPreviewImage] = useState('');
  const [churches, setChurches] = useState([]);
  const [notification, setNotification] = useState({ visible: false, message: '', color: '' });
  const [loading, setLoading] = useState(false);

  // Fetch churches (mock or API)
  useEffect(() => {
    const fetchChurches = async () => {
      setLoading(true);
      try {
        // Replace with actual API call
        const mockChurches = [
          { id: '1', name: 'St. Mary Cathedral' },
          { id: '2', name: 'Holy Trinity Church' },
          { id: '3', name: 'St. Michael Parish' },
          { id: '4', name: 'St. Gabriel Church' },
        ];
        setChurches(mockChurches);
      } catch (error) {
        console.error('Error fetching churches:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChurches();
  }, []);

  const handleFileChange = (file) => {
    if (file) {
      setIdPhoto(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!fullName || !phoneNumber || !birthDate || !selectedChurch || !idPhoto) {
      setNotification({
        visible: true,
        message: 'Please fill in all required fields',
        color: 'red',
      });
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('fullName', fullName);
    formData.append('phoneNumber', phoneNumber);
    formData.append('birthDate', birthDate.toISOString());
    formData.append('churchId', selectedChurch);
    formData.append('idPhoto', idPhoto);

    try {
      const response = await fetch('https://your-api-endpoint.com/api/church-fathers', {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${Cookies.get('access_token') || ''}`,
        },
      });

      if (response.ok) {
        setNotification({
          visible: true,
          message: 'Registration successful!',
          color: 'green',
        });
        // Reset form
        setFullName('');
        setPhoneNumber('');
        setBirthDate(null);
        setSelectedChurch('');
        setIdPhoto(null);
        setPreviewImage('');
      } else {
        const errorData = await response.json();
        setNotification({
          visible: true,
          message: errorData.message || 'Registration failed',
          color: 'red',
        });
      }
    } catch (error) {
      setNotification({
        visible: true,
        message: 'Network error. Please try again.',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container style={{ marginTop: 40, maxWidth: 800 }}>
      <Title order={2} mb="xl">Church Father Registration</Title>

      {notification.visible && (
        <Notification
          color={notification.color}
          onClose={() => setNotification({ ...notification, visible: false })}
          mb="md"
        >
          {notification.message}
        </Notification>
      )}

      {loading && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
        }}>
          <Loader size="xl" />
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <Grid gutter="md">
          <Grid.Col span={{ base: 12, md: 6 }}>
            <TextInput
              label="Full Name"
              placeholder="Enter full name"
              value={fullName}
              onChange={(e) => setFullName(e.currentTarget.value)}
              required
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <TextInput
              label="Phone Number"
              placeholder="Enter phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.currentTarget.value)}
              required
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <DatePickerInput
              label="Birth Date"
              placeholder="Select birth date"
              value={birthDate}
              onChange={setBirthDate}
              maxDate={new Date()}
              required
              locale="am"
              dropdownType="popover"
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Select
              label="Select Church"
              placeholder="Choose your church"
              data={churches.map((church) => ({
                value: church.id,
                label: church.name,
              }))}
              value={selectedChurch}
              onChange={setSelectedChurch}
              required
            />
          </Grid.Col>

          <Grid.Col span={12}>
            <FileInput
              label="Upload ID Photo"
              placeholder="Click to upload"
              accept="image/*"
              onChange={handleFileChange}
              required
            />
            {previewImage && (
              <Avatar
                src={previewImage}
                size="xl"
                mt="sm"
                style={{ border: '1px solid #ddd' }}
              />
            )}
          </Grid.Col>

          <Grid.Col span={12} mt="md">
            <Group justify="flex-end">
              <Button type="submit" size="md">
                Register
              </Button>
            </Group>
          </Grid.Col>
        </Grid>
      </form>
    </Container>
  );
}
