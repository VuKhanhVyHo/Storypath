// Required information
const API_BASE_URL = 'https://0b5ff8b0.uqcloud.net/api';
const JWT_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic3R1ZGVudCIsInVzZXJuYW1lIjoiczQ3NTk3ODYifQ.BlLNPbIWXnVgFre1kIE76UVw-X49DvPPJSeG2agfa_Q';
const USERNAME = 's4759786';

async function apiRequest(endpoint, method = 'GET', body = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${JWT_TOKEN}`,
    },
  };

  if (method === 'POST' || method === 'PATCH') {
    options.headers['Prefer'] = 'return=representation';
  }

  if (body) {
    options.body = JSON.stringify({ ...body, username: USERNAME });
  }

  // Fetching the API
  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

  // If response isn't okay, throw an error with status
  if (!response.ok) {
    const message = `HTTP error! status: ${response.status} ${response.statusText}`;
    throw new Error(message);
  }

  // Handle DELETE requests separately
  if (method === 'DELETE') {
    return response.status === 204 || response.status === 200;
  }

  return response.json();
}

// CRUD Operations for Projects
export async function updateProject(id, projectData) {
  return apiRequest(`/project?id=eq.${id}`, 'PATCH', projectData);
}

export async function createProject(projectData) {
  return apiRequest('/project', 'POST', projectData);
}

export async function getProjects() {
  return apiRequest('/project');
}

export async function getProject(id) {
  return apiRequest(`/project?id=eq.${id}`);
}

export async function deleteProject(id) {
  return apiRequest(`/project?id=eq.${id}`, 'DELETE');
}

// CRUD Operations for Locations
export async function getLocationsByProjectId(projectId) {
  return apiRequest(`/location?project_id=eq.${projectId}`);
}

export async function deleteLocationById(locationId) {
  return apiRequest(`/location?id=eq.${locationId}`, 'DELETE');
}

export async function getLocationById(id) {
  return apiRequest(`/location?id=eq.${id}`);
}

export async function createLocation(locationData) {
  return apiRequest('/location', 'POST', locationData);
}

export async function updateLocation(id, locationData) {
  return apiRequest(`/location?id=eq.${id}`, 'PATCH', locationData);
}

export async function getParticipants() {
  return apiRequest(`/tracking`)
}

export async function getParticipantByName(participant_username) {
  return apiRequest(`/tracking?participant_username=eq.${participant_username}`);
}

export async function unlockLocation(project_id, participant_username) {
  return apiRequest(`/tracking?project_id=eq.${project_id}&participant_username=eq.${participant_username}`)
}

export async function addLocation(trackData) {
  return apiRequest('/tracking', 'POST', trackData);
}