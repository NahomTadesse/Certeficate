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

// Mock data for church members
const mockMembers = [
  {
    id: 1,
    name: 'Yohannes Birhanu',
    phoneNumber: '+251911222333',
    churchName: 'St. George Church',
    registeredAt: '2023-01-15T09:30:00Z',
    churchFather: 'Abebe Kebede',
  },
  {
    id: 2,
    name: 'Mekdes Alemu',
    phoneNumber: '+251911223344',
    churchName: 'Holy Savior Church',
    registeredAt: '2023-02-20T14:15:00Z',
    churchFather: 'Abreham Hailu',
  },
  {
    id: 3,
    name: 'Henok Dawit',
    phoneNumber: '+251911334455',
    churchName: 'Medhane Alem Church',
    registeredAt: '2023-03-10T11:45:00Z',
    churchFather: 'Dagem Tesfaye',
  },
];

export default function MembersTable() {
  const [members, setMembers] = useState(mockMembers);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [notification, setNotification] = useState({ visible: false, message: '', color: '' });
  const [search, setSearch] = useState('');
  const [opened, { open, close }] = useDisclosure(false);
  const [currentMember, setCurrentMember] = useState(null);
  const [editForm, setEditForm] = useState({});

  const handleEditClick = (member) => {
    setCurrentMember(member);
    setEditForm({ ...member });
    open();
  };

  const handleFormChange = (field, value) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setActionLoading(true);
    setTimeout(() => {
      setMembers(members.map(m => m.id === currentMember.id ? { ...editForm } : m));
      setNotification({
        visible: true,
        message: `Member ${editForm.name} updated successfully`,
        color: 'green'
      });
      setActionLoading(false);
      close();
    }, 1000);
  };

  const handleDelete = (id) => {
    setActionLoading(true);
    setTimeout(() => {
      setMembers(members.filter(m => m.id !== id));
      setNotification({ visible: true, message: `Record deleted`, color: 'green' });
      setActionLoading(false);
    }, 1000);
  };

  const filteredMembers = members.filter((member) => {
    return (
      member.name.toLowerCase().includes(search.toLowerCase()) ||
      member.phoneNumber.includes(search) ||
      member.churchName.toLowerCase().includes(search.toLowerCase()) ||
      member.churchFather.toLowerCase().includes(search.toLowerCase())
    );
  });

  const rows = filteredMembers.map((member) => (
    <Table.Tr key={member.id}>
      <Table.Td>{member.name}</Table.Td>
      <Table.Td>{member.phoneNumber}</Table.Td>
      <Table.Td>{member.churchName}</Table.Td>
      <Table.Td>{new Date(member.registeredAt).toLocaleDateString()}</Table.Td>
      <Table.Td>{member.churchFather}</Table.Td>
      <Table.Td>
        <Group spacing="xs">
          <Button
            onClick={() => handleEditClick(member)}
            variant="light"
            color="blue"
            leftIcon={<IconEdit size={16} />}
            loading={actionLoading}
            size="xs"
          >
            Edit
          </Button>
          <Button
            onClick={() => handleDelete(member.id)}
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
      <Title order={2} style={{ marginTop: 45, marginLeft: 20 }}>Church Members List</Title>

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
              placeholder="Search by name, phone, church, or father"
              value={search}
              onChange={(event) => setSearch(event.currentTarget.value)}
              icon={<IconSearch size={16} />}
              style={{ flex: 1, maxWidth: 500 }}
            />
          </Group>
          <Table horizontalSpacing="md" verticalSpacing="xs" miw={800}>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Name</Table.Th>
                <Table.Th>Phone</Table.Th>
                <Table.Th>Church</Table.Th>
                <Table.Th>Date of Registration</Table.Th>
                <Table.Th>Church Father</Table.Th>
                <Table.Th>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {rows.length > 0 ? rows : (
                <Table.Tr>
                  <Table.Td colSpan={6}>
                    <Text fw={500} ta="center">
                      No members found
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
            title={`Edit Member: ${currentMember?.name}`}
            size="lg"
          >
            {currentMember && (
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
                <TextInput
                  label="Church Father"
                  value={editForm.churchFather || ''}
                  onChange={(e) => handleFormChange('churchFather', e.target.value)}
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
