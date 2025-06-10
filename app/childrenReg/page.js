"use client";
import { useState, useEffect, useMemo } from 'react';
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
  Checkbox,
  Table, // Import Table for displaying family members
  Text, // Import Text for table messages
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import '@mantine/dates/styles.css';
import 'dayjs/locale/am'; // For Amharic locale support in DatePickerInput
import Cookies from 'js-cookie'; // For accessing cookies (e.g., access_token)
import { IconCheck, IconX } from '@tabler/icons-react'; // For notification icons

// --- Mock Data Definitions ---
// Note: In pure JavaScript, we define objects directly,
// without explicit interfaces as seen in TypeScript.
const mockChurches = [
  { id: '1', name: 'St. Mary Cathedral' },
  { id: '2', name: 'Holy Trinity Church' },
  { id: '3', name: 'St. George Church' },
  { id: '4', name: 'Medhane Alem Church' },
];

const mockFathers = [
  { id: 'f1', name: 'Abba Tesfaye' },
  { id: 'f2', name: 'Abba Yohannes' },
  { id: 'f3', 'name': 'Abba Dagem' },
  { id: 'f4', name: 'Abba Samuel' },
];

const mockCountries = [{ value: 'Ethiopia', label: 'Ethiopia' }];
const mockStates = [{ value: 'Addis Ababa', label: 'Addis Ababa' }];
const mockSubstates = [
  { value: 'Arada', label: 'Arada' },
  { value: 'Kirkos', label: 'Kirkos' },
  { value: 'Bole', label: 'Bole' },
];
const mockWeredas = [
  { value: 'Wereda 1', label: 'Wereda 1' },
  { value: 'Wereda 2', label: 'Wereda 2' },
  { value: 'Wereda 3', label: 'Wereda 3' },
];

const mockFamilies = [
  {
    id: 'fam1',
    name: 'Kebede Family',
    isMarried: true,
    hasKids: true,
    members: [
      { id: 'm1', name: 'Abebe Kebede', age: 45, houseNumber: '123', state: 'Addis Ababa', substate: 'Arada', country: 'Ethiopia', wereda: 'Wereda 1', role: 'Head' },
      { id: 'm2', name: 'Aregash Kebede', age: 42, houseNumber: '123', state: 'Addis Ababa', substate: 'Arada', country: 'Ethiopia', wereda: 'Wereda 1', role: 'Spouse' },
      { id: 'm3', name: 'Kidist Kebede', age: 15, houseNumber: '123', state: 'Addis Ababa', substate: 'Arada', country: 'Ethiopia', wereda: 'Wereda 1', role: 'Child' },
    ]
  },
  {
    id: 'fam2',
    name: 'Hailu Family',
    isMarried: false,
    hasKids: true, // Example: Single parent with kids
    members: [
      { id: 'm4', name: 'Abreham Hailu', age: 38, houseNumber: '456', state: 'Addis Ababa', substate: 'Bole', country: 'Ethiopia', wereda: 'Wereda 2', role: 'Head' },
      { id: 'm5', name: 'Samuel Hailu', age: 10, houseNumber: '456', state: 'Addis Ababa', substate: 'Bole', country: 'Ethiopia', wereda: 'Wereda 2', role: 'Child' },
    ]
  },
];
// --- End Mock Data Definitions ---

export default function ChurchMemberRegistration() {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [birthDate, setBirthDate] = useState(null);
  const [grandfatherName, setGrandfatherName] = useState('');
  const [houseNumber, setHouseNumber] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('Ethiopia');
  const [selectedState, setSelectedState] = useState('Addis Ababa');
  const [selectedSubstate, setSelectedSubstate] = useState('');
  const [selectedWereda, setSelectedWereda] = useState('');

  const [selectedChurch, setSelectedChurch] = useState('');
  const [idPhoto, setIdPhoto] = useState(null);
  const [previewImage, setPreviewImage] = useState('');
  const [churches, setChurches] = useState([]);
  const [fathers, setFathers] = useState([]);
  const [selectedFather, setSelectedFather] = useState('');

  const [role, setRole] = useState('Father');
  const [isAssociatedWithFamily, setIsAssociatedWithFamily] = useState(false);
  const [familyOption, setFamilyOption] = useState(null); // 'existing' or 'new'
  const [existingFamilies, setExistingFamilies] = useState([]);
  const [selectedExistingFamilyId, setSelectedExistingFamilyId] = useState(null);
  const [newFamilyName, setNewFamilyName] = useState('');
  const [isMarried, setIsMarried] = useState(false);
  const [hasKidsInNewFamily, setHasKidsInNewFamily] = useState(false);

  const [notification, setNotification] = useState({ visible: false, message: '', color: '' });
  const [loading, setLoading] = useState(false);

  // Calculate age based on birthDate
  const age = useMemo(() => {
    if (!birthDate) return null;
    const today = new Date();
    let calculatedAge = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      calculatedAge--;
    }
    return calculatedAge;
  }, [birthDate]);

  // Fetch initial data (churches, fathers, existing families, locations)
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        // Simulate API calls
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay

        setChurches(mockChurches);
        setFathers(mockFathers);
        setExistingFamilies(mockFamilies); // Populate existing families
      } catch (error) {
        console.error('Error fetching data:', error);
        setNotification({
          visible: true,
          message: 'Failed to load initial data. Please try again.',
          color: 'red',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Get the currently selected existing family for table display
  const selectedFamilyForDisplay = useMemo(() => {
    if (familyOption === 'existing' && selectedExistingFamilyId) {
      return existingFamilies.find(f => f.id === selectedExistingFamilyId);
    }
    return null;
  }, [familyOption, selectedExistingFamilyId, existingFamilies]);


  const handleFileChange = (file) => {
    if (file) {
      setIdPhoto(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result);
      };
      reader.readAsDataURL(file);
    } else {
      setIdPhoto(null);
      setPreviewImage('');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Basic validation
    if (!fullName || !phoneNumber || !birthDate || !selectedChurch || !idPhoto || !grandfatherName || !houseNumber || !selectedCountry || !selectedState || !selectedSubstate || !selectedWereda) {
      setNotification({
        visible: true,
        message: 'Please fill in all required personal and address fields.',
        color: 'red',
      });
      return;
    }

    if (role === 'Son' && isAssociatedWithFamily && !selectedFather) {
      setNotification({
        visible: true,
        message: 'Please select a church father for the son.',
        color: 'red',
      });
      return;
    }

    if (isAssociatedWithFamily) {
      if (!familyOption) {
        setNotification({
          visible: true,
          message: 'Please select an option for family (Existing or New).',
          color: 'red',
        });
        return;
      }
      if (familyOption === 'existing' && !selectedExistingFamilyId) {
        setNotification({
          visible: true,
          message: 'Please select an existing family.',
          color: 'red',
        });
        return;
      }
      if (familyOption === 'new' && !newFamilyName.trim()) {
        setNotification({
          visible: true,
          message: 'Please enter a name for the new family.',
          color: 'red',
        });
        return;
      }
    }


    setLoading(true);

    const formData = new FormData();
    formData.append('fullName', fullName);
    formData.append('phoneNumber', phoneNumber);
    formData.append('birthDate', birthDate.toISOString());
    formData.append('age', age?.toString() || ''); // Append calculated age
    formData.append('grandfatherName', grandfatherName);
    formData.append('houseNumber', houseNumber);
    formData.append('country', selectedCountry);
    formData.append('state', selectedState);
    formData.append('substate', selectedSubstate);
    formData.append('wereda', selectedWereda);
    formData.append('churchId', selectedChurch);
    formData.append('idPhoto', idPhoto);
    formData.append('role', role);

    if (role === 'Son' && isAssociatedWithFamily && selectedFather) {
      formData.append('fatherId', selectedFather);
    }

    // Family association logic
    formData.append('isAssociatedWithFamily', String(isAssociatedWithFamily));
    if (isAssociatedWithFamily) {
      formData.append('familyOption', familyOption || '');
      if (familyOption === 'existing' && selectedExistingFamilyId) {
        formData.append('existingFamilyId', selectedExistingFamilyId);
      } else if (familyOption === 'new') {
        formData.append('newFamilyName', newFamilyName);
        formData.append('isMarried', String(isMarried));
        formData.append('hasKidsInNewFamily', String(hasKidsInNewFamily));
      }
    }

    try {
      // Replace with your actual API endpoint
      const response = await fetch('https://your-api-endpoint.com/api/church-members', {
        method: 'POST',
        body: formData,
        headers: {
          // 'Content-Type': 'multipart/form-data' is typically not needed for FormData,
          // browser sets it automatically with correct boundary.
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
        setGrandfatherName('');
        setHouseNumber('');
        setSelectedCountry('Ethiopia');
        setSelectedState('Addis Ababa');
        setSelectedSubstate('');
        setSelectedWereda('');
        setSelectedChurch('');
        setIdPhoto(null);
        setPreviewImage('');
        setRole('Father');
        setIsAssociatedWithFamily(false);
        setSelectedFather('');
        setFamilyOption(null);
        setSelectedExistingFamilyId(null);
        setNewFamilyName('');
        setIsMarried(false);
        setHasKidsInNewFamily(false);
      } else {
        const errorData = await response.json();
        setNotification({
          visible: true,
          message: errorData.message || 'Registration failed',
          color: 'red',
        });
      }
    } catch (error) {
      console.error('Network error during registration:', error);
      setNotification({
        visible: true,
        message: 'Network error. Please check your connection and try again.',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container style={{ marginTop: 40, maxWidth: 900 }}>
      <Title order={2} mb="xl">Church Member Registration</Title>

      {notification.visible && (
        <Notification
          color={notification.color}
          onClose={() => setNotification({ ...notification, visible: false })}
          mb="md"
          icon={notification.color === 'green' ? <IconCheck size={18} /> : <IconX size={18} />}
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
          {/* Personal Information */}
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
              label="Grandfather's Name"
              placeholder="Enter grandfather's name"
              value={grandfatherName}
              onChange={(e) => setGrandfatherName(e.currentTarget.value)}
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

          {age !== null && (
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                label="Age"
                value={age.toString()}
                readOnly
                disabled
              />
            </Grid.Col>
          )}

          {/* Location Information */}
          <Grid.Col span={{ base: 12, md: 6 }}>
            <TextInput
              label="House Number"
              placeholder="Enter house number"
              value={houseNumber}
              onChange={(e) => setHouseNumber(e.currentTarget.value)}
              required
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Select
              label="Country"
              placeholder="Select country"
              data={mockCountries}
              value={selectedCountry}
              onChange={(value) => setSelectedCountry(value || '')}
              required
              searchable
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Select
              label="State (Region)"
              placeholder="Select state"
              data={mockStates}
              value={selectedState}
              onChange={(value) => setSelectedState(value || '')}
              required
              searchable
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Select
              label="Substate (Zone)"
              placeholder="Select substate"
              data={mockSubstates}
              value={selectedSubstate}
              onChange={(value) => setSelectedSubstate(value || '')}
              required
              searchable
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Select
              label="Wereda (District)"
              placeholder="Select wereda"
              data={mockWeredas}
              value={selectedWereda}
              onChange={(value) => setSelectedWereda(value || '')}
              required
              searchable
            />
          </Grid.Col>

          {/* Church and Role Information */}
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Select
              label="Select Church"
              placeholder="Choose your church"
              data={churches.map((church) => ({
                value: church.id,
                label: church.name,
              }))}
              value={selectedChurch}
              onChange={(value) => setSelectedChurch(value || '')}
              required
              searchable
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Select
              label="Role"
              placeholder="Father or Son"
              data={[
                { value: 'Father', label: 'Father' },
                { value: 'Son', label: 'Son' },
              ]}
              value={role}
              onChange={(value) => {
                setRole(value || 'Father');
                if (value === 'Father') {
                  setSelectedFather(''); // Reset father-specific fields if role changes to Father
                }
              }}
              required
            />
          </Grid.Col>

          {/* Family Association Section */}
          <Grid.Col span={12}>
            <Checkbox
              label="Is this member associated with a family?"
              checked={isAssociatedWithFamily}
              onChange={(e) => {
                setIsAssociatedWithFamily(e.currentTarget.checked);
                // Reset family-related selections if checkbox is unchecked
                if (!e.currentTarget.checked) {
                  setFamilyOption(null);
                  setSelectedExistingFamilyId(null);
                  setNewFamilyName('');
                  setIsMarried(false);
                  setHasKidsInNewFamily(false);
                }
              }}
            />
          </Grid.Col>

          {isAssociatedWithFamily && (
            <>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Select
                  label="Family Option"
                  placeholder="Select family option"
                  data={[
                    { value: 'existing', label: 'Select Existing Family' },
                    { value: 'new', label: 'Create New Family' },
                  ]}
                  value={familyOption}
                  onChange={(value) => {
                    setFamilyOption(value);
                    // Reset other family option fields when changing
                    setSelectedExistingFamilyId(null);
                    setNewFamilyName('');
                    setIsMarried(false);
                    setHasKidsInNewFamily(false);
                  }}
                  required
                />
              </Grid.Col>

              {/* Select Existing Family */}
              {familyOption === 'existing' && (
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Select
                    label="Select Existing Family"
                    placeholder="Search and choose family"
                    data={existingFamilies.map((fam) => ({
                      value: fam.id,
                      label: fam.name,
                    }))}
                    value={selectedExistingFamilyId}
                    onChange={(value) => setSelectedExistingFamilyId(value)}
                    required
                    searchable
                    clearable
                  />
                </Grid.Col>
              )}

              {/* Display Existing Family Members */}
              {selectedFamilyForDisplay && (
                <Grid.Col span={12}>
                  <Title order={4} my="sm">Family Members of {selectedFamilyForDisplay.name}</Title>
                  <Table striped highlightOnHover withTableBorder withColumnBorders>
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th>Name</Table.Th>
                        <Table.Th>Role</Table.Th>
                        <Table.Th>Age</Table.Th>
                        <Table.Th>House No.</Table.Th>
                        <Table.Th>Wereda</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {selectedFamilyForDisplay.members.length > 0 ? (
                        selectedFamilyForDisplay.members.map((member) => (
                          <Table.Tr key={member.id}>
                            <Table.Td>{member.name}</Table.Td>
                            <Table.Td>{member.role || 'Member'}</Table.Td>
                            <Table.Td>{member.age}</Table.Td>
                            <Table.Td>{member.houseNumber}</Table.Td>
                            <Table.Td>{member.wereda}</Table.Td>
                          </Table.Tr>
                        ))
                      ) : (
                        <Table.Tr>
                          <Table.Td colSpan={5}>
                            <Text align="center" c="dimmed">No members found in this family.</Text>
                          </Table.Td>
                        </Table.Tr>
                      )}
                    </Table.Tbody>
                  </Table>
                </Grid.Col>
              )}

              {/* Create New Family */}
              {familyOption === 'new' && (
                <>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <TextInput
                      label="New Family Name"
                      placeholder="e.g., John Doe's Family"
                      value={newFamilyName}
                      onChange={(e) => setNewFamilyName(e.currentTarget.value)}
                      required
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 3 }}>
                    <Checkbox
                      label="Married?"
                      checked={isMarried}
                      onChange={(e) => setIsMarried(e.currentTarget.checked)}
                      mt="xl"
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 3 }}>
                    <Checkbox
                      label="Has Kids?"
                      checked={hasKidsInNewFamily}
                      onChange={(e) => setHasKidsInNewFamily(e.currentTarget.checked)}
                      mt="xl"
                    />
                  </Grid.Col>
                </>
              )}
            </>
          )}

          {/* Select Father for Son Role */}
          {role === 'Son' && (
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Select
                label="Select Church Father"
                placeholder="Choose your church father"
                data={fathers.map((father) => ({
                  value: father.id,
                  label: father.name,
                }))}
                value={selectedFather}
                onChange={(value) => setSelectedFather(value || '')}
                // Required if son is associated with a family, but not if standalone
                required={isAssociatedWithFamily}
                searchable
                clearable
              />
            </Grid.Col>
          )}

          {/* ID Photo Upload */}
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

          {/* Submit Button */}
          <Grid.Col span={12} mt="md">
            <Group justify="flex-end">
              <Button type="submit" size="md">
                Register Member
              </Button>
            </Group>
          </Grid.Col>
        </Grid>
      </form>
    </Container>
  );
}