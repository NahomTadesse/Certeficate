"use client";
import { useState } from "react";
import {
  Button,
  Container,
  TextInput,
  Title,
  FileInput,
  Table,
  Group,
  Stack,
  Notification,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { v4 as uuidv4 } from "uuid";
import { IconEdit, IconSearch, IconUpload } from "@tabler/icons-react";

import jsPDF from "jspdf";

export default function ArtifactRegister() {
  const [resources, setResources] = useState([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    name: "",
    date: new Date(),
    photo: null,
  });
  const [notification, setNotification] = useState({ visible: false, message: "", color: "" });
  const [editingId, setEditingId] = useState(null);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!form.name || !form.date || !form.photo) {
      setNotification({ visible: true, message: "All fields are required", color: "red" });
      return;
    }

    if (editingId) {
      setResources((prev) =>
        prev.map((r) =>
          r.id === editingId ? { ...r, ...form, date: form.date.toISOString().split("T")[0] } : r
        )
      );
      setNotification({ visible: true, message: "Resource updated", color: "green" });
      setEditingId(null);
    } else {
      const newResource = {
        id: uuidv4(),
        name: form.name,
        date: form.date.toISOString().split("T")[0],
        photo: URL.createObjectURL(form.photo),
      };
      setResources((prev) => [...prev, newResource]);
      setNotification({ visible: true, message: "Resource registered", color: "green" });
    }

    setForm({ name: "", date: new Date(), photo: null });
  };

  const handleEdit = (resource) => {
    setEditingId(resource.id);
    setForm({
      name: resource.name,
      date: new Date(resource.date),
      photo: null,
    });
  };

  const filteredResources = resources.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Container mt="lg">
      <Title order={2} mb="md">
        Register Artifact / Resource
      </Title>

      {notification.visible && (
        <Notification
          color={notification.color}
          onClose={() => setNotification((n) => ({ ...n, visible: false }))}
          mb="md"
        >
          {notification.message}
        </Notification>
      )}

      <Stack spacing="md">
        <TextInput
          label="Name"
          placeholder="Enter artifact/resource name"
          value={form.name}
          onChange={(e) => handleChange("name", e.currentTarget.value)}
          required
        />
        <DateInput
          label="Date"
          value={form.date}
          onChange={(value) => handleChange("date", value)}
          required
        />
        <FileInput
          label="Photo"
          placeholder="Upload a photo"
          accept="image/*"
          value={form.photo}
          onChange={(value) => handleChange("photo", value)}
          icon={<IconUpload size={16} />}
          required={!editingId}
        />
        <Button onClick={handleSubmit}>{editingId ? "Update" : "Register"}</Button>

        <TextInput
          icon={<IconSearch size={16} />}
          placeholder="Search by name or ID"
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
        />
      </Stack>

      <Table striped highlightOnHover mt="lg" withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>ID</Table.Th>
            <Table.Th>Name</Table.Th>
            <Table.Th>Date</Table.Th>
            <Table.Th>Photo</Table.Th>
            <Table.Th>Action</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {filteredResources.length > 0 ? (
            filteredResources.map((r) => (
              <Table.Tr key={r.id}>
                <Table.Td>{r.id}</Table.Td>
                <Table.Td>{r.name}</Table.Td>
                <Table.Td>{r.date}</Table.Td>
                <Table.Td>
                  <img src={r.photo} alt="artifact" style={{ width: 60 }} />
                </Table.Td>
                <Table.Td>
                  <Button
                    size="xs"
                    variant="light"
                    color="blue"
                    onClick={() => handleEdit(r)}
                    leftIcon={<IconEdit size={14} />}
                  >
                    Edit
                  </Button>
                </Table.Td>
              </Table.Tr>
            ))
          ) : (
            <Table.Tr>
              <Table.Td colSpan={5} align="center">
                No resources found.
              </Table.Td>
            </Table.Tr>
          )}
        </Table.Tbody>
      </Table>
    </Container>
  );
}
