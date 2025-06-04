"use client";
import { useState, useEffect } from "react";
import {
  Container,
  Title,
  Select,
  TextInput,
  Button,
  Stack,
  Notification,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import jsPDF from "jspdf";

export default function CertificateForm() {
  const [certificateType, setCertificateType] = useState("");
  const [date, setDate] = useState(null);
  const [place, setPlace] = useState("");

  // Common data
  const [fathers, setFathers] = useState([]);

  // Birth / Death
  const [personName, setPersonName] = useState("");
  const [selectedFatherId, setSelectedFatherId] = useState("");

  // Marriage
  const [husbandName, setHusbandName] = useState("");
  const [wifeName, setWifeName] = useState("");
  const [husbandFatherId, setHusbandFatherId] = useState("");
  const [wifeFatherId, setWifeFatherId] = useState("");

  const [causeOfDeath, setCauseOfDeath] = useState("");
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    // Fetch mock church fathers
    const mockFathers = [
      { id: "1", name: "Father Abraham" },
      { id: "2", name: "Father Isaac" },
      { id: "3", name: "Father Jacob" },
    ];
    setFathers(mockFathers);
  }, []);

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(`${certificateType} Certificate`, 20, 20);
    doc.setFontSize(12);

    if (!certificateType || !date || !place) {
      setNotification({ message: "Please fill all required fields.", color: "red" });
      return;
    }

    doc.text(`Date: ${date.toLocaleDateString()}`, 20, 40);
    doc.text(`Place: ${place}`, 20, 50);

    if (certificateType === "Birth") {
      if (!personName || !selectedFatherId) return setNotification({ message: "Fill all required fields.", color: "red" });
      const father = fathers.find(f => f.id === selectedFatherId)?.name;
      doc.text(`Child Name: ${personName}`, 20, 60);
      doc.text(`Church Father: ${father}`, 20, 70);

    } else if (certificateType === "Marriage") {
      if (!husbandName || !wifeName || !husbandFatherId || !wifeFatherId) {
        return setNotification({ message: "Fill all required fields.", color: "red" });
      }
      const husbandFather = fathers.find(f => f.id === husbandFatherId)?.name;
      const wifeFather = fathers.find(f => f.id === wifeFatherId)?.name;
      doc.text(`Husband Name: ${husbandName}`, 20, 60);
      doc.text(`Wife Name: ${wifeName}`, 20, 70);
      doc.text(`Husband's Church Father: ${husbandFather}`, 20, 80);
      doc.text(`Wife's Church Father: ${wifeFather}`, 20, 90);

    } else if (certificateType === "Death") {
      if (!personName || !selectedFatherId || !causeOfDeath) return setNotification({ message: "Fill all required fields.", color: "red" });
      const father = fathers.find(f => f.id === selectedFatherId)?.name;
      doc.text(`Deceased Name: ${personName}`, 20, 60);
      doc.text(`Cause of Death: ${causeOfDeath}`, 20, 70);
      doc.text(`Church Father: ${father}`, 20, 80);
    }

    doc.save(`${certificateType}_Certificate.pdf`);
    setNotification({ message: "PDF generated successfully.", color: "green" });
  };

  return (
    <Container size="sm" mt="lg">
      <Title order={2} mb="md">Generate Certificate</Title>

      {notification && (
        <Notification color={notification.color} onClose={() => setNotification(null)}>
          {notification.message}
        </Notification>
      )}

      <Stack spacing="md">
        <Select
          label="Certificate Type"
          placeholder="Select type"
          data={["Birth", "Marriage", "Death"]}
          value={certificateType}
          onChange={(value) => {
            setCertificateType(value);
            setNotification(null);
            // reset dynamic fields
            setPersonName("");
            setHusbandName("");
            setWifeName("");
            setCauseOfDeath("");
            setSelectedFatherId("");
            setHusbandFatherId("");
            setWifeFatherId("");
          }}
          required
        />

        <DateInput
          label="Date"
          value={date}
          onChange={setDate}
          required
        />

        <TextInput
          label="Place"
          value={place}
          onChange={(e) => setPlace(e.currentTarget.value)}
          required
        />

        {certificateType === "Birth" && (
          <>
            <TextInput
              label="Child Name"
              value={personName}
              onChange={(e) => setPersonName(e.currentTarget.value)}
              required
            />
            <Select
              label="Church Father"
              placeholder="Select father"
              data={fathers.map(f => ({ value: f.id, label: f.name }))}
              value={selectedFatherId}
              onChange={setSelectedFatherId}
              searchable
              required
            />
          </>
        )}

        {certificateType === "Marriage" && (
          <>
            <TextInput
              label="Husband Name"
              value={husbandName}
              onChange={(e) => setHusbandName(e.currentTarget.value)}
              required
            />
            <Select
              label="Husband's Church Father"
              placeholder="Select father"
              data={fathers.map(f => ({ value: f.id, label: f.name }))}
              value={husbandFatherId}
              onChange={setHusbandFatherId}
              searchable
              required
            />

            <TextInput
              label="Wife Name"
              value={wifeName}
              onChange={(e) => setWifeName(e.currentTarget.value)}
              required
            />
            <Select
              label="Wife's Church Father"
              placeholder="Select father"
              data={fathers.map(f => ({ value: f.id, label: f.name }))}
              value={wifeFatherId}
              onChange={setWifeFatherId}
              searchable
              required
            />
          </>
        )}

        {certificateType === "Death" && (
          <>
            <TextInput
              label="Deceased Name"
              value={personName}
              onChange={(e) => setPersonName(e.currentTarget.value)}
              required
            />
            <TextInput
              label="Cause of Death"
              value={causeOfDeath}
              onChange={(e) => setCauseOfDeath(e.currentTarget.value)}
              required
            />
            <Select
              label="Church Father"
              placeholder="Select father"
              data={fathers.map(f => ({ value: f.id, label: f.name }))}
              value={selectedFatherId}
              onChange={setSelectedFatherId}
              searchable
              required
            />
          </>
        )}

        <Button onClick={generatePDF}>Generate PDF</Button>
      </Stack>
    </Container>
  );
}
