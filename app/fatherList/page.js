"use client";
import { useState } from 'react';
import {
  Button,
  Center,
  Group,
  Loader,
  ScrollArea,
  Table,
  Text,
  Title,
  Notification,
  TextInput,
  Modal,
  Stack,
  NumberInput,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconCheck, IconX, IconSearch, IconEdit, IconTrash } from '@tabler/icons-react';

// Mock data for fathers
const mockFathers = [
  {
    id: 1,
    name: 'Abebe Kebede',
    phoneNumber: '+251911111111',
    churchName: 'St. George Church',
    registeredAt: '2023-01-15T09:30:00Z',
    childrenCount: 3
  },
  {
    id: 2,
    name: 'Abreham Hailu',
    phoneNumber: '+251911121212',
    churchName: 'Holy Savior Church',
    registeredAt: '2023-02-20T14:15:00Z',
    childrenCount: 2
  },
  {
    id: 3,
    name: 'Dagem Tesfaye',
    phoneNumber: '+2519111131313',
    churchName: 'Medhane Alem Church',
    registeredAt: '2023-03-10T11:45:00Z',
    childrenCount: 5
  },
];

export default function FathersTable() {
  const [fathers, setFathers] = useState(mockFathers);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [notification, setNotification] = useState({ visible: false, message: '', color: '' });
  const [search, setSearch] = useState('');
  const [opened, { open, close }] = useDisclosure(false);
  const [currentFather, setCurrentFather] = useState(null);
  const [editForm, setEditForm] = useState({});

  const handleEditClick = (father) => {
    setCurrentFather(father);
    setEditForm({ ...father });
    open();
  };

  const handleFormChange = (field, value) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setActionLoading(true);
    setTimeout(() => {
      setFathers(fathers.map(f => f.id === currentFather.id ? { ...editForm } : f));
      setNotification({
        visible: true,
        message: `Father ${editForm.name} updated successfully`,
        color: 'green'
      });
      setActionLoading(false);
      close();
    }, 1000);
  };

  const handleDelete = (id) => {
    setActionLoading(true);
    setTimeout(() => {
      setFathers(fathers.filter(f => f.id !== id));
      setNotification({ visible: true, message: `Record deleted`, color: 'green' });
      setActionLoading(false);
    }, 1000);
  };

  const filteredFathers = fathers.filter((father) => {
    return (
      father.name.toLowerCase().includes(search.toLowerCase()) ||
      father.phoneNumber.includes(search) ||
      father.churchName.toLowerCase().includes(search.toLowerCase())
    );
  });

  const rows = filteredFathers.map((father) => (
    <Table.Tr key={father.id}>
      <Table.Td>{father.name}</Table.Td>
      <Table.Td>{father.phoneNumber}</Table.Td>
      <Table.Td>{father.churchName}</Table.Td>
      <Table.Td>{new Date(father.registeredAt).toLocaleDateString()}</Table.Td>
      <Table.Td>{father.childrenCount}</Table.Td>
      <Table.Td>
        <Group spacing="xs">
          <Button
            onClick={() => handleEditClick(father)}
            variant="light"
            color="blue"
            leftIcon={<IconEdit size={16} />}
            loading={actionLoading}
            size="xs"
          >
            Edit
          </Button>
          <Button
            onClick={() => handleDelete(father.id)}
            variant="light"
            color="red"
            leftIcon={<IconTrash size={16} />}
            loading={actionLoading}
            size="xs"
          >
            Delete
          </Button>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <ScrollArea>
      <Title order={2} style={{ marginTop: 45, marginLeft: 20 }}>Fathers List</Title>
      {notification.visible && (
        <Notification
          color={notification.color}
          onClose={() => setNotification({ ...notification, visible: false })}
          style={{ margin: '20px' }}
        >
          {notification.message}
        </Notification>
      )}
      {loading || actionLoading ? (
        <Center style={{ height: '100vh' }}>
          <Loader />
        </Center>
      ) : (
        <>
          <Group position="apart" style={{ margin: '20px' }}>
            <TextInput
              placeholder="Search by name, phone, or church"
              value={search}
              onChange={(event) => setSearch(event.currentTarget.value)}
              icon={<IconSearch size={16} />}
              style={{ flex: 1, maxWidth: 500 }}
            />
          </Group>
          <Table horizontalSpacing="md" verticalSpacing="xs" miw={700}>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Name</Table.Th>
                <Table.Th>Phone</Table.Th>
                <Table.Th>Church</Table.Th>
                <Table.Th>Date of Registration</Table.Th>
                <Table.Th>Children</Table.Th>
                <Table.Th>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {rows.length > 0 ? rows : (
                <Table.Tr>
                  <Table.Td colSpan={6}>
                    <Text fw={500} ta="center">
                      No fathers found
                    </Text>
                  </Table.Td>
                </Table.Tr>
              )}
            </Table.Tbody>
          </Table>

          {/* Edit Modal */}
          <Modal
            opened={opened}
            onClose={close}
            title={`Edit Father: ${currentFather?.name}`}
            size="lg"
          >
            {currentFather && (
              <Stack>
                <TextInput
                  label="Full Name"
                  value={editForm.name || ''}
                  onChange={(e) => handleFormChange('name', e.target.value)}
                />
                <TextInput
                  label="Phone Number"
                  value={editForm.phoneNumber || ''}
                  onChange={(e) => handleFormChange('phoneNumber', e.target.value)}
                />
                <TextInput
                  label="Church Name"
                  value={editForm.churchName || ''}
                  onChange={(e) => handleFormChange('churchName', e.target.value)}
                />
                <TextInput
                  label="Date of Registration"
                  type="date"
                  value={editForm.registeredAt?.split('T')[0] || ''}
                  onChange={(e) => handleFormChange('registeredAt', e.target.value)}
                />
                <NumberInput
                  label="Number of Children"
                  value={editForm.childrenCount || 0}
                  onChange={(value) => handleFormChange('childrenCount', value)}
                  min={0}
                />
                <Group position="right" mt="md">
                  <Button variant="outline" onClick={close}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    loading={actionLoading}
                    leftIcon={<IconCheck size={16} />}
                  >
                    Save Changes
                  </Button>
                </Group>
              </Stack>
            )}
          </Modal>
        </>
      )}
    </ScrollArea>
  );
}
