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
  Radio,
  Group,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import jsPDF from "jspdf";
import '@mantine/dates/styles.css';
import 'dayjs/locale/am';
export default function CertificateForm() {
  const [certificateType, setCertificateType] = useState("");
  const [date, setDate] = useState(null);
  const [place, setPlace] = useState("");

  // Common dropdown data
  const countries = ["Ethiopia","United States", "Canada",];
  const nationalities = ["Ethiopian","American", "Canadian",];
  const churches = ["Mariam", "Michael", "Urael"];
  const priests = ["Abebe","kebede"];

  // Birth Certificate fields
  const [gender, setGender] = useState("");
  const [familyName, setFamilyName] = useState("");
  const [properName, setProperName] = useState("");
  const [christianName, setChristianName] = useState("");
  const [fathersName, setFathersName] = useState("");
  const [mothersName, setMothersName] = useState("");
  const [godParentName, setGodParentName] = useState("");
  const [placeOfBirth, setPlaceOfBirth] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState(null);
  const [dateOfBaptism, setDateOfBaptism] = useState(null);
  const [baptizingPriest, setBaptizingPriest] = useState("");
  const [citizenship, setCitizenship] = useState("");

  // Marriage Certificate fields
  const [groomName, setGroomName] = useState("");
  const [groomNationality, setGroomNationality] = useState("");
  const [brideName, setBrideName] = useState("");
  const [brideNationality, setBrideNationality] = useState("");
  const [priestName, setPriestName] = useState("");
  const [churchName, setChurchName] = useState("");
  const [country, setCountry] = useState("");
  const [witnesses, setWitnesses] = useState(["", "", ""]);

  // Death Certificate fields
  const [personName, setPersonName] = useState("");
  const [selectedFatherId, setSelectedFatherId] = useState("");
  const [causeOfDeath, setCauseOfDeath] = useState("");
  
  const [notification, setNotification] = useState(null);

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(`${certificateType} Certificate`, 20, 20);
    doc.setFontSize(12);

    if (!certificateType) {
      setNotification({ message: "Please select a certificate type.", color: "red" });
      return;
    }

    if (certificateType === "Birth") {
      if (
        !familyName || !properName || !christianName ||
        !fathersName || !mothersName || !godParentName ||
        !placeOfBirth || !dateOfBirth || !dateOfBaptism ||
        !baptizingPriest || !citizenship || !gender
      ) {
        return setNotification({ message: "Fill all required fields.", color: "red" });
      }

      doc.text(`Family Name: ${familyName}`, 20, 40);
      doc.text(`Proper Name: ${properName}`, 20, 50);
      doc.text(`Christian Name: ${christianName}`, 20, 60);
      doc.text(`Gender: ${gender}`, 20, 70);
      doc.text(`Father's Name: ${fathersName}`, 20, 80);
      doc.text(`Mother's Name: ${mothersName}`, 20, 90);
      doc.text(`${gender === "Male" ? "God Father" : "God Mother"}: ${godParentName}`, 20, 100);
      doc.text(`Place of Birth: ${placeOfBirth}`, 20, 110);
      doc.text(`Date of Birth: ${dateOfBirth.toLocaleDateString()}`, 20, 120);
      doc.text(`Nationality: ${citizenship}`, 20, 130);
      doc.text(`Date of Baptism: ${dateOfBaptism.toLocaleDateString()}`, 20, 140);
      doc.text(`Church: ${baptizingPriest}`, 20, 150);
      doc.text(`Baptizing Priest: ${baptizingPriest}`, 20, 160);
      doc.text(`Citizenship: ${citizenship}`, 20, 170);

    } else if (certificateType === "Marriage") {
      if (
        !groomName || !groomNationality ||
        !brideName || !brideNationality ||
        !priestName || !churchName || !country ||
        witnesses.some(w => !w)
      ) {
        return setNotification({ message: "Fill all required fields.", color: "red" });
      }

      doc.text(`Date: ${date.toLocaleDateString()}`, 20, 40);
      doc.text(`Place: ${place}`, 20, 50);
      doc.text(`Groom Name: ${groomName}`, 20, 60);
      doc.text(`Groom Nationality: ${groomNationality}`, 20, 70);
      doc.text(`Bride Name: ${brideName}`, 20, 80);
      doc.text(`Bride Nationality: ${brideNationality}`, 20, 90);
      doc.text(`Performing Priest: ${priestName}`, 20, 100);
      doc.text(`Church: ${churchName}`, 20, 110);
      doc.text(`Country: ${country}`, 20, 120);
      witnesses.forEach((w, idx) => {
        doc.text(`Witness ${idx + 1}: ${w}`, 20, 130 + idx * 10);
      });

    } else if (certificateType === "Death") {
      if (!personName || !date || !place || !causeOfDeath) {
        return setNotification({ message: "Fill all required fields.", color: "red" });
      }
      doc.text(`Date: ${date.toLocaleDateString()}`, 20, 40);
      doc.text(`Place: ${place}`, 20, 50);
      doc.text(`Deceased Name: ${personName}`, 20, 60);
      doc.text(`Cause of Death: ${causeOfDeath}`, 20, 70);
    }

    doc.save(`${certificateType}_Certificate.pdf`);
    setNotification({ message: "PDF generated successfully.", color: "green" });
  };

  const resetForm = () => {
    setDate(null);
    setPlace("");
    setPersonName("");
    setCauseOfDeath("");
    setGroomName("");
    setGroomNationality("");
    setBrideName("");
    setBrideNationality("");
    setPriestName("");
    setChurchName("");
    setCountry("");
    setWitnesses(["", "", ""]);
    setGender("");
    setFamilyName("");
    setProperName("");
    setChristianName("");
    setFathersName("");
    setMothersName("");
    setGodParentName("");
    setPlaceOfBirth("");
    setDateOfBirth(null);
    setDateOfBaptism(null);
    setBaptizingPriest("");
    setCitizenship("");
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
            resetForm();
          }}
          required
        />

        {certificateType && (
          <>
            {certificateType !== "Birth" && (
              <>
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
              </>
            )}

            {certificateType === "Birth" && (
              <>
                <TextInput
                  label="Family Name"
                  value={familyName}
                  onChange={(e) => setFamilyName(e.currentTarget.value)}
                  required
                />
                <TextInput
                  label="Proper Name"
                  value={properName}
                  onChange={(e) => setProperName(e.currentTarget.value)}
                  required
                />
                <TextInput
                  label="Christian Name"
                  value={christianName}
                  onChange={(e) => setChristianName(e.currentTarget.value)}
                  required
                />
                
                <Radio.Group
                  name="gender"
                  label="Gender"
                  value={gender}
                  onChange={setGender}
                  required
                >
                  <Group mt="xs">
                    <Radio value="Male" label="Male" />
                    <Radio value="Female" label="Female" />
                  </Group>
                </Radio.Group>
                
                <TextInput
                  label="Father's Name"
                  value={fathersName}
                  onChange={(e) => setFathersName(e.currentTarget.value)}
                  required
                />
                <TextInput
                  label="Mother's Name"
                  value={mothersName}
                  onChange={(e) => setMothersName(e.currentTarget.value)}
                  required
                />
                <TextInput
                  label={gender ? (gender === "Male" ? "God Father Name" : "God Mother Name") : "God Parent Name"}
                  value={godParentName}
                  onChange={(e) => setGodParentName(e.currentTarget.value)}
                  required
                />
                <TextInput
                  label="Place of Birth"
                  value={placeOfBirth}
                  onChange={(e) => setPlaceOfBirth(e.currentTarget.value)}
                  required
                />
                <DateInput
                  label="Date of Birth"
                  value={dateOfBirth}
                  onChange={setDateOfBirth}
                  required
                />
                <Select
                  label="Nationality"
                  placeholder="Select nationality"
                  data={nationalities}
                  value={citizenship}
                  onChange={setCitizenship}
                  required
                />
                <DateInput
                  label="Date of Baptism"
                  value={dateOfBaptism}
                  onChange={setDateOfBaptism}
                  required
                />
                <Select
                  label="Church"
                  placeholder="Select church"
                  data={churches}
                  value={baptizingPriest}
                  onChange={setBaptizingPriest}
                  required
                />
                <Select
                  label="Citizenship"
                  placeholder="Select citizenship"
                  data={countries}
                  value={citizenship}
                  onChange={setCitizenship}
                  required
                />
              </>
            )}

            {certificateType === "Marriage" && (
              <>
                <TextInput
                  label="Groom Name"
                  value={groomName}
                  onChange={(e) => setGroomName(e.currentTarget.value)}
                  required
                />
                <Select
                  label="Groom Nationality"
                  placeholder="Select nationality"
                  data={nationalities}
                  value={groomNationality}
                  onChange={setGroomNationality}
                  required
                />
                <TextInput
                  label="Bride Name"
                  value={brideName}
                  onChange={(e) => setBrideName(e.currentTarget.value)}
                  required
                />
                <Select
                  label="Bride Nationality"
                  placeholder="Select nationality"
                  data={nationalities}
                  value={brideNationality}
                  onChange={setBrideNationality}
                  required
                />
                <Select
                  label="Performing Priest"
                  placeholder="Select priest"
                  data={priests}
                  value={priestName}
                  onChange={setPriestName}
                  required
                />
                <Select
                  label="Church"
                  placeholder="Select church"
                  data={churches}
                  value={churchName}
                  onChange={setChurchName}
                  required
                />
                <Select
                  label="Country"
                  placeholder="Select country"
                  data={countries}
                  value={country}
                  onChange={setCountry}
                  required
                />
                {witnesses.map((w, i) => (
                  <TextInput
                    key={i}
                    label={`Witness ${i + 1} Name`}
                    value={w}
                    onChange={(e) => {
                      const newWitnesses = [...witnesses];
                      newWitnesses[i] = e.currentTarget.value;
                      setWitnesses(newWitnesses);
                    }}
                    required
                  />
                ))}
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
              </>
            )}

            <Button onClick={generatePDF}>Generate PDF</Button>
          </>
        )}
      </Stack>
    </Container>
  );
}