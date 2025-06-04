"use client";
import { useEffect, useState } from 'react';
import {
  Button,
  Checkbox,
  Container,
  Notification,
  Select,
  Title,
  Stack,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import '@mantine/dates/styles.css';
import 'dayjs/locale/am';

export default function RegisterChild() {
  const [children, setChildren] = useState([]);
  const [fathers, setFathers] = useState([]);
  const [families, setFamilies] = useState([]);

  const [selectedChildId, setSelectedChildId] = useState('');
  const [selectedFatherId, setSelectedFatherId] = useState('');
  const [selectedFamilyId, setSelectedFamilyId] = useState('');
  const [hasFamily, setHasFamily] = useState(false);
  const [registrationDate, setRegistrationDate] = useState(new Date());
  const [notification, setNotification] = useState({ visible: false, message: '', color: '' });

  // Use mock data instead of fetching
  useEffect(() => {
    // Mock data
    const mockChildren = [
      { id: 'c1', name: 'Abel Yohannes' },
      { id: 'c2', name: 'Liya Solomon' },
      { id: 'c3', name: 'Nahom Daniel' },
    ];

    const mockFathers = [
      { id: 'f1', name: 'Melaku Tadesse' },
      { id: 'f2', name: 'Berhanu Kassa' },
      { id: 'f3', name: 'Yohannes Desta' },
    ];

    const mockFamilies = [
      { id: 'fam1', name: 'Family of Faith' },
      { id: 'fam2', name: 'House of Hope' },
      { id: 'fam3', name: 'Grace Group' },
    ];

    setChildren(mockChildren);
    setFathers(mockFathers);
    setFamilies(mockFamilies);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedChildId || !selectedFatherId || !registrationDate) {
      setNotification({ visible: true, message: 'All required fields must be filled.', color: 'red' });
      return;
    }

    const payload = {
      childId: selectedChildId,
      fatherId: selectedFatherId,
      familyId: hasFamily ? selectedFamilyId : null,
      registrationDate,
    };

    // Simulate API call with delay
    setTimeout(() => {
      console.log("Submitted payload:", payload);
      setNotification({ visible: true, message: 'Child registered successfully (mock).', color: 'green' });

      // Reset form
      setSelectedChildId('');
      setSelectedFatherId('');
      setSelectedFamilyId('');
      setHasFamily(false);
      setRegistrationDate(new Date());
    }, 1000);
  };

  return (
    <Container size="sm" mt="lg">
      <Title order={2} mb="md">Register Child to Father</Title>
      {notification.visible && (
        <Notification color={notification.color} onClose={() => setNotification({ ...notification, visible: false })}>
          {notification.message}
        </Notification>
      )}

      <form onSubmit={handleSubmit}>
        <Stack spacing="md">
          <Select
            label="Select Child"
            placeholder="Choose a child"
            searchable
            data={children.map(child => ({ value: child.id, label: child.name }))}
            value={selectedChildId}
            onChange={setSelectedChildId}
            required
          />

          <Select
            label="Select Church Father"
            placeholder="Choose a father"
            searchable
            data={fathers.map(father => ({ value: father.id, label: father.name }))}
            value={selectedFatherId}
            onChange={setSelectedFatherId}
            required
          />

          <DateInput
            label="Registration Date"
            value={registrationDate}
            onChange={setRegistrationDate}
            required
          />

          <Checkbox
            label="Has Family?"
            checked={hasFamily}
            onChange={(event) => setHasFamily(event.currentTarget.checked)}
          />

          {hasFamily && (
            <Select
              label="Select Family"
              placeholder="Choose a family"
              searchable
              data={families.map(fam => ({ value: fam.id, label: fam.name }))}
              value={selectedFamilyId}
              onChange={setSelectedFamilyId}
              required
            />
          )}

          <Button type="submit">Submit</Button>
        </Stack>
      </form>
    </Container>
  );
}
