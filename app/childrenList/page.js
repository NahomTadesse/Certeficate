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
  Select,
  Menu,
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
  IconRefresh, // For transfer action
} from '@tabler/icons-react';

const mockChildren = [
  {
    id: 1,
    name: 'Yohannes Birhanu',
    phoneNumber: '+251911222333',
    churchName: 'St. George Church',
    registeredAt: '2023-01-15T09:30:00Z',
    churchFather: 'Abebe Kebede',
    status: 'active',
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

const churchFathers = [
  'Abebe Kebede',
  'Abreham Hailu',
  'Dagem Tesfaye',
  'Samuel Alemu',
  'John Doe',
  'Peter Smith',
];

export default function TransferChildrenTable() {
  const [children, setChildren] = useState(mockChildren);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [notification, setNotification] = useState({ visible: false, message: '', color: '' });
  const [search, setSearch] = useState('');
  const [opened, { open, close }] = useDisclosure(false);
  const [currentChild, setCurrentChild] = useState(null);
  const [transferForm, setTransferForm] = useState({ churchName: '', churchFather: '' });

  const handleTransferClick = (child) => {
    setCurrentChild(child);
    setTransferForm({
      churchName: child.churchName,
      churchFather: child.churchFather,
    });
    open();
  };

  const handleTransferChange = (field, value) => {
    setTransferForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleTransferSave = () => {
    setActionLoading(true);
    setTimeout(() => {
      setChildren((prev) =>
        prev.map((child) =>
          child.id === currentChild.id
            ? { ...child, ...transferForm }
            : child
        )
      );
      setNotification({
        visible: true,
        message: `Child ${currentChild.name} transferred successfully.`,
        color: 'green',
      });
      setActionLoading(false);
      close();
    }, 1000);
  };

  const handleDelete = (id) => {
    setActionLoading(true);
    setTimeout(() => {
      setChildren((prev) => prev.filter((child) => child.id !== id));
      setNotification({ visible: true, message: 'Record deleted successfully', color: 'green' });
      setActionLoading(false);
    }, 1000);
  };

  const handleSuspendToggle = (id) => {
    setActionLoading(true);
    setTimeout(() => {
      setChildren((prev) =>
        prev.map((child) =>
          child.id === id
            ? { ...child, status: child.status === 'active' ? 'suspended' : 'active' }
            : child
        )
      );
      setNotification({
        visible: true,
        message: 'Child status updated successfully',
        color: 'green',
      });
      setActionLoading(false);
    }, 1000);
  };

  const filteredChildren = children.filter((child) =>
    [child.name, child.phoneNumber, child.churchName, child.churchFather]
      .some(field => field.toLowerCase().includes(search.toLowerCase()))
  );

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
        <Text color={child.status === 'active' ? 'green' : 'orange'} fw={500}>
          {child.status.charAt(0).toUpperCase() + child.status.slice(1)}
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
            <Menu.Item leftSection={<IconRefresh size={14} />} onClick={() => handleTransferClick(child)}>
              Transfer
            </Menu.Item>
            <Menu.Item leftSection={<IconPlayerPause size={14} />} onClick={() => handleSuspendToggle(child.id)}>
              {child.status === 'active' ? 'Suspend' : 'Activate'}
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item leftSection={<IconTrash size={14} />} color="red" onClick={() => handleDelete(child.id)}>
              Delete
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <ScrollArea>
      <Title order={2} mt={45} ml={20}>Transferred Children</Title>

      {notification.visible && (
        <Notification
          color={notification.color}
          onClose={() => setNotification({ ...notification, visible: false })}
          icon={notification.color === 'green' ? <IconCheck size={18} /> : <IconX size={18} />}
          mt="md"
          mx="md"
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
          <Group position="apart" my="md" mx="md">
            <TextInput
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.currentTarget.value)}
              leftSection={<IconSearch size={16} />}
              style={{ flex: 1, maxWidth: 500 }}
            />
          </Group>

          <Table horizontalSpacing="md" verticalSpacing="xs" miw={900}>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Name</Table.Th>
                <Table.Th>Phone</Table.Th>
                <Table.Th>Church</Table.Th>
                <Table.Th>Registered</Table.Th>
                <Table.Th>Father</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {rows.length > 0 ? rows : (
                <Table.Tr>
                  <Table.Td colSpan={7}>
                    <Text fw={500} ta="center" py="md">
                      No children found
                    </Text>
                  </Table.Td>
                </Table.Tr>
              )}
            </Table.Tbody>
          </Table>

          <Modal
            opened={opened}
            onClose={close}
            title={currentChild ? `Transfer Child: ${currentChild.name}` : 'Transfer Child'}
            centered
          >
            <Stack>
              <Select
                label="New Church Name"
                placeholder="Select new church"
                data={churchNames}
                value={transferForm.churchName}
                onChange={(value) => handleTransferChange('churchName', value)}
                searchable
              />
              <Select
                label="New Church Father"
                placeholder="Select new church father"
                data={churchFathers}
                value={transferForm.churchFather}
                onChange={(value) => handleTransferChange('churchFather', value)}
                searchable
              />
              <Group position="right" mt="md">
                <Button variant="outline" onClick={close}>
                  Cancel
                </Button>
                <Button
                  onClick={handleTransferSave}
                  loading={actionLoading}
                  leftSection={<IconCheck size={16} />}
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
