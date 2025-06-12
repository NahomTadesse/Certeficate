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
  Menu,
  Select,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconCheck,
  IconX,
  IconSearch,
  IconEdit,
  IconTrash,
  IconDotsVertical,
  IconPlayerPause,
} from '@tabler/icons-react';

// Mock data for fathers
const mockFathers = [
  {
    id: 1,
    name: 'Abebe Kebede',
    phoneNumber: '+251911111111',
    churchName: 'St. George Church',
    registeredAt: '2023-01-15T09:30:00Z',
    childrenCount: 3,
    status: 'active',
  },
  {
    id: 2,
    name: 'Abreham Hailu',
    phoneNumber: '+251911121212',
    churchName: 'Holy Savior Church',
    registeredAt: '2023-02-20T14:15:00Z',
    childrenCount: 2,
    status: 'active',
  },
  {
    id: 3,
    name: 'Dagem Tesfaye',
    phoneNumber: '+2519111131313',
    churchName: 'Medhane Alem Church',
    registeredAt: '2023-03-10T11:45:00Z',
    childrenCount: 5,
    status: 'active',
  },
  {
    id: 4,
    name: 'Samuel Alemu',
    phoneNumber: '+251911144444',
    churchName: 'St. Mary Church',
    registeredAt: '2023-04-01T08:00:00Z',
    childrenCount: 1,
    status: 'suspended',
  },
];

const churchNames = [
  'St. George Church',
  'Holy Savior Church',
  'Medhane Alem Church',
  'St. Mary Church',
  'Trinity Church',
  'Debre Libanos Monastery',
  'St. Michael Church',
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

  const [transferModalOpened, { open: openTransfer, close: closeTransfer }] = useDisclosure(false);
  const [selectedFatherForTransfer, setSelectedFatherForTransfer] = useState(null);
  const [newChurch, setNewChurch] = useState(null);

  const handleEditClick = (father) => {
    setCurrentFather(father);
    setEditForm({
      ...father,
      registeredAt: father.registeredAt ? father.registeredAt.split('T')[0] : '',
    });
    open();
  };

  const handleFormChange = (field, value) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setActionLoading(true);
    setTimeout(() => {
      setFathers(fathers.map(f =>
        f.id === currentFather.id
          ? {
              ...editForm,
              registeredAt: editForm.registeredAt ? new Date(editForm.registeredAt).toISOString() : '',
            }
          : f
      ));
      setNotification({
        visible: true,
        message: `Father ${editForm.name} updated successfully`,
        color: 'green',
      });
      setActionLoading(false);
      close();
    }, 1000);
  };

  const handleDelete = (id) => {
    setActionLoading(true);
    setTimeout(() => {
      setFathers(fathers.filter(f => f.id !== id));
      setNotification({ visible: true, message: `Record deleted successfully`, color: 'green' });
      setActionLoading(false);
    }, 1000);
  };

  const handleSuspendToggle = (id) => {
    setActionLoading(true);
    setTimeout(() => {
      setFathers(fathers.map(f =>
        f.id === id
          ? { ...f, status: f.status === 'active' ? 'suspended' : 'active' }
          : f
      ));
      setNotification({
        visible: true,
        message: `Father status updated successfully`,
        color: 'green',
      });
      setActionLoading(false);
    }, 1000);
  };

  const handleTransferClick = (father) => {
    setSelectedFatherForTransfer(father);
    setNewChurch(null);
    openTransfer();
  };

  const handleConfirmTransfer = () => {
    if (!newChurch || !selectedFatherForTransfer) return;

    setActionLoading(true);
    setTimeout(() => {
      setFathers(fathers.map(f =>
        f.id === selectedFatherForTransfer.id
          ? { ...f, churchName: newChurch }
          : f
      ));
      setNotification({
        visible: true,
        message: `Father ${selectedFatherForTransfer.name} transferred to ${newChurch}`,
        color: 'green',
      });
      setActionLoading(false);
      closeTransfer();
    }, 1000);
  };

  const filteredFathers = fathers.filter((father) =>
    father.name.toLowerCase().includes(search.toLowerCase()) ||
    father.phoneNumber.includes(search) ||
    father.churchName.toLowerCase().includes(search.toLowerCase())
  );

  const rows = filteredFathers.map((father) => (
    <Table.Tr key={father.id}>
      <Table.Td>{father.name}</Table.Td>
      <Table.Td>{father.phoneNumber}</Table.Td>
      <Table.Td>{father.churchName}</Table.Td>
      <Table.Td>
        {father.registeredAt ? new Date(father.registeredAt).toLocaleDateString() : 'N/A'}
      </Table.Td>
      <Table.Td>{father.childrenCount}</Table.Td>
      <Table.Td>
        <Text size="sm" color={father.status === 'active' ? 'green' : 'orange'} fw={500}>
          {father.status.charAt(0).toUpperCase() + father.status.slice(1)}
        </Text>
      </Table.Td>
      <Table.Td>
        <Menu shadow="md" width={160} position="bottom-end">
          <Menu.Target>
            <Button variant="subtle" color="gray" compact loading={actionLoading}>
              <IconDotsVertical size={16} />
            </Button>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item icon={<IconEdit size={14} />} onClick={() => handleEditClick(father)}>
              Edit
            </Menu.Item>
            <Menu.Item icon={<IconPlayerPause size={14} />} onClick={() => handleSuspendToggle(father.id)}>
              {father.status === 'active' ? 'Suspend' : 'Activate'}
            </Menu.Item>
            <Menu.Item icon={<IconEdit size={14} />} onClick={() => handleTransferClick(father)}>
              Transfer
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item icon={<IconTrash size={14} />} color="red" onClick={() => handleDelete(father.id)}>
              Delete
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
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
          icon={notification.color === 'green' ? <IconCheck size={18} /> : <IconX size={18} />}
        >
          {notification.message}
        </Notification>
      )}

      {loading || actionLoading ? (
        <Center style={{ height: 'calc(100vh - 120px)' }}>
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
                <Table.Th>Status</Table.Th>
                <Table.Th>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {rows.length > 0 ? rows : (
                <Table.Tr>
                  <Table.Td colSpan={7}>
                    <Text fw={500} ta="center" py="md">
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
            title={currentFather ? `Edit Father: ${currentFather.name}` : 'Edit Father'}
            size="lg"
            centered
          >
            {currentFather && (
              <Stack>
                <TextInput
                  label="Full Name"
                  value={editForm.name || ''}
                  onChange={(e) => handleFormChange('name', e.target.value)}
                  placeholder="Enter full name"
                />
                <TextInput
                  label="Phone Number"
                  value={editForm.phoneNumber || ''}
                  onChange={(e) => handleFormChange('phoneNumber', e.target.value)}
                  placeholder="e.g., +251912345678"
                />
                {/* <Select
                  label="Church Name"
                  placeholder="Select church"
                  data={churchNames}
                  value={editForm.churchName || null}
                  onChange={(value) => handleFormChange('churchName', value)}
                  searchable
                  clearable
                /> */}
                <TextInput
                  label="Date of Registration"
                  type="date"
                  value={editForm.registeredAt || ''}
                  onChange={(e) => handleFormChange('registeredAt', e.target.value)}
                />
                <NumberInput
                  label="Number of Children"
                  value={editForm.childrenCount || 0}
                  onChange={(value) => handleFormChange('childrenCount', value)}
                  min={0}
                  placeholder="Enter number of children"
                />
                <Group position="right" mt="md">
                  <Button variant="outline" onClick={close}>Cancel</Button>
                  <Button onClick={handleSave} loading={actionLoading} leftSection={<IconCheck size={16} />}>
                    Save Changes
                  </Button>
                </Group>
              </Stack>
            )}
          </Modal>

          {/* Transfer Modal */}
          <Modal
            opened={transferModalOpened}
            onClose={closeTransfer}
            title={selectedFatherForTransfer ? `Transfer Father: ${selectedFatherForTransfer.name}` : 'Transfer Father'}
            centered
          >
            <Stack>
              <Select
                label="Select New Church"
                data={churchNames.filter(name => name !== selectedFatherForTransfer?.churchName)}
                placeholder="Choose new church"
                value={newChurch}
                onChange={setNewChurch}
                searchable
                clearable
              />
              <Group position="right" mt="md">
                <Button variant="default" onClick={closeTransfer}>
                  Cancel
                </Button>
                <Button
                  color="blue"
                  onClick={handleConfirmTransfer}
                  disabled={!newChurch}
                  loading={actionLoading}
                >
                  Confirm Transfer
                </Button>
              </Group>
            </Stack>
          </Modal>
        </>
      )}
    </ScrollArea>
  );
}
