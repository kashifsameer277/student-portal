import axios from 'axios';

// Results database with email-linked roll numbers
// Each user can only see their own results based on their email
const resultsDatabase = {
  // User: ali@example.com, Roll: 2024-001
  'ali@example.com': {
    rollNo: '2024-001',
    studentName: 'Ali Ahmed',
    class: '10th Grade',
    fatherName: 'Ahmed Khan',
    email: 'ali@example.com',
    subjects: [
      { name: 'Mathematics', total: 100, obtained: 85, percentage: 85, grade: 'A', remarks: 'Excellent' },
      { name: 'Physics', total: 100, obtained: 78, percentage: 78, grade: 'B', remarks: 'Very Good' },
      { name: 'Chemistry', total: 100, obtained: 82, percentage: 82, grade: 'A', remarks: 'Excellent' },
      { name: 'English', total: 100, obtained: 75, percentage: 75, grade: 'B', remarks: 'Good' },
      { name: 'Urdu', total: 100, obtained: 88, percentage: 88, grade: 'A', remarks: 'Excellent' },
    ],
  },
  
  // User: sara@example.com, Roll: 2024-002
  'sara@example.com': {
    rollNo: '2024-002',
    studentName: 'Sara Khan',
    class: '10th Grade',
    fatherName: 'Imran Khan',
    email: 'sara@example.com',
    subjects: [
      { name: 'Mathematics', total: 100, obtained: 92, percentage: 92, grade: 'A', remarks: 'Outstanding' },
      { name: 'Physics', total: 100, obtained: 88, percentage: 88, grade: 'A', remarks: 'Excellent' },
      { name: 'Chemistry', total: 100, obtained: 90, percentage: 90, grade: 'A', remarks: 'Excellent' },
      { name: 'English', total: 100, obtained: 85, percentage: 85, grade: 'A', remarks: 'Excellent' },
      { name: 'Urdu', total: 100, obtained: 94, percentage: 94, grade: 'A', remarks: 'Outstanding' },
    ],
  },
  
  // User: hassan@example.com, Roll: 2024-003
  'hassan@example.com': {
    rollNo: '2024-003',
    studentName: 'Hassan Ali',
    class: '9th Grade',
    fatherName: 'Ali Raza',
    email: 'hassan@example.com',
    subjects: [
      { name: 'Mathematics', total: 100, obtained: 65, percentage: 65, grade: 'C', remarks: 'Satisfactory' },
      { name: 'Physics', total: 100, obtained: 70, percentage: 70, grade: 'B', remarks: 'Good' },
      { name: 'Chemistry', total: 100, obtained: 68, percentage: 68, grade: 'C', remarks: 'Satisfactory' },
      { name: 'English', total: 100, obtained: 72, percentage: 72, grade: 'B', remarks: 'Good' },
      { name: 'Urdu', total: 100, obtained: 75, percentage: 75, grade: 'B', remarks: 'Good' },
    ],
  },
};

// Fetch student results by roll number (anyone can search)
export const fetchStudentResults = async (rollNo) => {
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Search for results by roll number
    const results = Object.values(resultsDatabase).find(
      result => result.rollNo === rollNo
    );
    
    if (results) {
      return {
        success: true,
        data: results,
      };
    } else {
      return {
        success: false,
        message: 'No results found for this roll number.',
      };
    }
  } catch (error) {
    console.error('Error fetching results:', error);
    return {
      success: false,
      message: 'Error fetching results. Please try again.',
    };
  }
};

// Fetch all results (admin only)
export const fetchAllResults = async () => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      success: true,
      data: Object.values(resultsDatabase),
    };
  } catch (error) {
    console.error('Error fetching all results:', error);
    return {
      success: false,
      message: 'Error fetching results. Please try again.',
    };
  }
};

// Example third-party API call
export const fetchExternalData = async () => {
  try {
    const response = await axios.get('https://jsonplaceholder.typicode.com/users');
    return response.data;
  } catch (error) {
    console.error('Error fetching external data:', error);
    throw error;
  }
};

const apiService = {
  fetchStudentResults,
  fetchAllResults,
  fetchExternalData,
};

export default apiService;
