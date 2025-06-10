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
  Select, // Import Select for dropdowns
  Menu, // Import Menu for the three-dot actions
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconCheck,
  IconX,
  IconSearch,
  IconEdit,
  IconTrash,
  IconDotsVertical, // For the three-dot icon
  IconPlayerPause, // For suspend action
} from '@tabler/icons-react';

// Mock data for church children
const mockChildren = [
  {
    id: 1,
    name: 'Yohannes Birhanu',
    phoneNumber: '+251911222333',
    churchName: 'St. George Church',
    registeredAt: '2023-01-15T09:30:00Z',
    churchFather: 'Abebe Kebede',
    status: 'active', // Added status for suspend functionality
  },
  {
    id: 2,
    name: 'Mekdes Alemu',
    phoneNumber: '+251911223344',
    churchName: 'Holy Savior Church',
    registeredAt: '2023-02-20T14:15:00Z',
    churchFather: 'Abreham Hailu',
    status: 'active',
  },
  {
    id: 3,
    name: 'Henok Dawit',
    phoneNumber: '+251911334455',
    churchName: 'Medhane Alem Church',
    registeredAt: '2023-03-10T11:45:00Z',
    churchFather: 'Dagem Tesfaye',
    status: 'active',
  },
  {
    id: 4,
    name: 'Tigist Fantu',
    phoneNumber: '+251911445566',
    churchName: 'St. Mary Church',
    registeredAt: '2023-04-01T08:00:00Z',
    churchFather: 'Samuel Alemu',
    status: 'suspended', // Example suspended child
  },
];

// Mock list of church names for the dropdown (if you also want church name to be a dropdown)
const churchNames = [
  'St. George Church',
  'Holy Savior Church',
  'Medhane Alem Church',
  'St. Mary Church',
  'Trinity Church',
  'Debre Libanos Monastery',
  'St. Michael Church',
];

// Mock list of Church Fathers for the dropdown
const mockChurchFathers = [
  'Abebe Kebede',
  'Abreham Hailu',
  'Dagem Tesfaye',
  'Samuel Alemu',
  'John Doe',
  'Peter Smith',
];

export default function ChildrenTable() {
  const [children, setChildren] = useState(mockChildren);
  const [loading, setLoading] = useState(false); // For initial data loading
  const [actionLoading, setActionLoading] = useState(false); // For individual action loading (edit/delete/suspend)
  const [notification, setNotification] = useState({ visible: false, message: '', color: '' });
  const [search, setSearch] = useState('');
  const [opened, { open, close }] = useDisclosure(false); // For the edit modal
  const [currentChild, setCurrentChild] = useState(null); // The child being edited
  const [editForm, setEditForm] = useState({}); // State for the edit form fields

  // Handle click on the "Edit" action
  const handleEditClick = (child) => {
    setCurrentChild(child);
    // Set initial form values, ensuring date is formatted correctly for type="date" input
    setEditForm({
      ...child,
      registeredAt: child.registeredAt ? child.registeredAt.split('T')[0] : '',
    });
    open(); // Open the modal
  };

  // Update form state as user types/selects
  const handleFormChange = (field, value) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  // Handle saving changes from the edit modal
  const handleSave = () => {
    setActionLoading(true);
    setTimeout(() => {
      setChildren(children.map(c =>
        c.id === currentChild.id
          ? {
              ...editForm,
              // Ensure registeredAt is saved in original ISO format if needed
              registeredAt: editForm.registeredAt ? new Date(editForm.registeredAt).toISOString() : '',
            }
          : c
      ));
      setNotification({
        visible: true,
        message: `Child ${editForm.name} updated successfully`,
        color: 'green',
      });
      setActionLoading(false);
      close(); // Close the modal after saving
    }, 1000); // Simulate API call delay
  };

  // Handle deleting a child
  const handleDelete = (id) => {
    setActionLoading(true);
    setTimeout(() => {
      setChildren(children.filter(c => c.id !== id));
      setNotification({ visible: true, message: `Record deleted successfully`, color: 'green' });
      setActionLoading(false);
    }, 1000); // Simulate API call delay
  };

  // Handle suspending/activating a child
  const handleSuspendToggle = (id) => {
    setActionLoading(true);
    setTimeout(() => {
      setChildren(children.map(c =>
        c.id === id
          ? { ...c, status: c.status === 'active' ? 'suspended' : 'active' }
          : c
      ));
      setNotification({
        visible: true,
        message: `Child status updated successfully`,
        color: 'green',
      });
      setActionLoading(false);
    }, 1000); // Simulate API call delay
  };

  // Filter children based on search input
  const filteredChildren = children.filter((child) => {
    return (
      child.name.toLowerCase().includes(search.toLowerCase()) ||
      child.phoneNumber.includes(search) ||
      child.churchName.toLowerCase().includes(search.toLowerCase()) ||
      child.churchFather.toLowerCase().includes(search.toLowerCase())
    );
  });

  // Generate table rows from filtered children data
  const rows = filteredChildren.map((child) => (
    <Table.Tr key={child.id}>
      <Table.Td>{child.name}</Table.Td>
      <Table.Td>{child.phoneNumber}</Table.Td>
      <Table.Td>{child.churchName}</Table.Td>
      <Table.Td>
        {child.registeredAt ? new Date(child.registeredAt).toLocaleDateString() : 'N/A'}
      </Table.Td>
      <Table.Td>{child.churchFather}</Table.Td>
      <Table.Td>
        <Text
          size="sm"
          color={child.status === 'active' ? 'green' : 'orange'}
          fw={500}
        >
          {child.status.charAt(0).toUpperCase() + child.status.slice(1)}
        </Text>
      </Table.Td>
      <Table.Td>
        <Menu shadow="md" width={150} position="bottom-end">
          <Menu.Target>
            <Button
              variant="subtle"
              color="gray"
              compact
              loading={actionLoading}
            >
              <IconDotsVertical size={16} />
            </Button>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item
              leftSection={<IconEdit size={14} />} // Use leftSection
              onClick={() => handleEditClick(child)}
            >
              Edit
            </Menu.Item>
            <Menu.Item
              leftSection={<IconPlayerPause size={14} />} // Use leftSection
              onClick={() => handleSuspendToggle(child.id)}
            >
              {child.status === 'active' ? 'Suspend' : 'Activate'}
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item
              leftSection={<IconTrash size={14} />} // Use leftSection
              color="red"
              onClick={() => handleDelete(child.id)}
            >
              Delete
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <ScrollArea>
      <Title order={2} style={{ marginTop: 45, marginLeft: 20 }}>Children List</Title>

      {/* Notification display */}
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

      {/* Loading indicator for initial data load or all actions */}
      {loading || actionLoading ? (
        <Center style={{ height: 'calc(100vh - 120px)' }}>
          <Loader />
        </Center>
      ) : (
        <>
          <Group position="apart" style={{ margin: '20px' }}>
            {/* Search input */}
            <TextInput
              placeholder="Search by name, phone, church, or father"
              value={search}
              onChange={(event) => setSearch(event.currentTarget.value)}
              leftSection={<IconSearch size={16} />} // Use leftSection
              style={{ flex: 1, maxWidth: 500 }}
            />
            {/* Add Child Button (optional) */}
            {/* <Button leftSection={<IconPlus size={16} />}>Add Child</Button> */}
          </Group>

          {/* Children Table */}
          <Table horizontalSpacing="md" verticalSpacing="xs" miw={900}> {/* Adjusted min-width */}
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Name</Table.Th>
                <Table.Th>Phone</Table.Th>
                <Table.Th>Church</Table.Th>
                <Table.Th>Date of Registration</Table.Th>
                <Table.Th>Church Father</Table.Th>
                <Table.Th>Status</Table.Th> {/* Added Status column */}
                <Table.Th>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {rows.length > 0 ? rows : (
                <Table.Tr>
                  <Table.Td colSpan={7}> {/* Adjusted colspan for new column */}
                    <Text fw={500} ta="center" py="md">
                      No children found
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
            title={currentChild ? `Edit Child: ${currentChild.name}` : 'Edit Child'}
            size="lg"
            centered
          >
            {currentChild && (
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
                <Select
                  label="Church Name"
                  placeholder="Select church"
                  data={churchNames} // Use the predefined list of church names
                  value={editForm.churchName || null}
                  onChange={(value) => handleFormChange('churchName', value)}
                  searchable
                  clearable
                />
                <TextInput
                  label="Date of Registration"
                  type="date"
                  value={editForm.registeredAt || ''}
                  onChange={(e) => handleFormChange('registeredAt', e.target.value)}
                />
                <Select
                  label="Church Father"
                  placeholder="Select church father"
                  data={mockChurchFathers} // Use the predefined list of church fathers
                  value={editForm.churchFather || null}
                  onChange={(value) => handleFormChange('churchFather', value)}
                  searchable
                  clearable
                />
                <Group position="right" mt="md">
                  <Button variant="outline" onClick={close}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    loading={actionLoading}
                    leftSection={<IconCheck size={16} />}
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