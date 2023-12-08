
import axios from 'axios';

const App = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileUpload = async () => {
    const formData = new FormData();
    formData.append('pdf', file);

    try {
      await axios.post('http://localhost:5000/upload', formData);
      console.log('PDF uploaded successfully!');
    } catch (error) {
      console.error('Error uploading PDF:', error.message);
    }
  };

  const handleFileDownload = async (id) => {
    try {
      const response = await axios.get(`http://localhost:5000/download/${id}`, { responseType: 'arraybuffer' });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch (error) {
      console.error('Error downloading PDF:', error.message);
    }
  };

  return (
    <div>
      <input type="file" accept=".pdf" onChange={handleFileChange} />
      <button onClick={handleFileUpload}>Upload PDF</button>
      <button onClick={() => handleFileDownload('replace-with-pdf-id')}>Download PDF</button>
    </div>
  );
};

export default App;
