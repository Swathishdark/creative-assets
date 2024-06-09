import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

const baseURL = process.env.REACT_APP_DIRECTUS_URL;

function App() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentOption, setCurrentOption] = useState('all');
  const [filterTag, setFilterTag] = useState('all');
  const [modalData, setModalData] = useState({ isOpen: false, imageSrc: '', imageName: '' });
  const [tooltip, setTooltip] = useState({ visible: false, content: '', x: 0, y: 0 });

  useEffect(() => {
    const fetchData = async () => {
      const token = await getAuthToken();
      if (token) {
        const result = await getData(token);
        setData(result);
        setFilteredData(result);
      }
    };
    fetchData();
  }, []);

  const getAuthToken = async () => {
    try {
      const response = await fetch('/api/get-token');
      const data = await response.json();
      if (response.ok) {
        return data.token;
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Error obtaining token:', error);
      return null;
    }
  };

  const getData = async (token) => {
    try {
      const response = await fetch(`/api/fetch-content?token=${token}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.map(item => ({
        imageName: item.asset_image,
        image: `${baseURL}/assets/${item.asset_image}`,
        contentName: item.asset_image,
        content: item.asset_message.replace(/\r\n/g, '<br>'),
        tags: item.transition_type,
        program: item.program_name,
      }));
    } catch (error) {
      console.error('Error fetching data from Directus:', error);
      return [];
    }
  };

  const filterData = useCallback(() => {
    let filtered = data;
    if (currentOption !== 'all') {
      filtered = filtered.filter(item => item.program.includes(currentOption));
    }
    if (filterTag !== 'all') {
      filtered = filtered.filter(item => item.tags.includes(filterTag));
    }
    setFilteredData(filtered);
  }, [currentOption, filterTag, data]);

  useEffect(() => {
    filterData();
  }, [currentOption, filterTag, data, filterData]);

  const handleOptionChange = (option) => {
    setCurrentOption(option);
    setFilterTag('all');
  };

  const handleFilterChange = (tag) => {
    setFilterTag(tag);
  };

  const showModal = (imageSrc, imageName) => {
    setModalData({ isOpen: true, imageSrc, imageName });
  };

  const closeModal = () => {
    setModalData({ isOpen: false, imageSrc: '', imageName: '' });
  };

  const handleCopyContent = (e, content, contentName) => {
    e.preventDefault();
    const el = document.createElement('div');
    el.innerHTML = content;
    el.contentEditable = 'true';
    document.body.appendChild(el);

    const range = document.createRange();
    range.selectNodeContents(el);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);

    try {
      document.execCommand('copy');
      alert('Content copied');
    } catch (err) {
      console.error('Failed to copy', err);
    } finally {
      document.body.removeChild(el);
    }
  };

  const handleDownloadImage = (e, imageSrc, imageName) => {
    e.preventDefault();
    const link = document.createElement('a');
    link.href = imageSrc;
    link.setAttribute('download', `${imageName}.jpg`);
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleMouseMove = (e, content) => {
    setTooltip({
      visible: true,
      content,
      x: e.clientX,
      y: e.clientY,
    });
  };

  const handleMouseLeave = () => {
    setTooltip({
      visible: false,
      content: '',
      x: 0,
      y: 0,
    });
  };

  return (
    <div className="App">
      <div id="options">
        <button id="all" onClick={() => handleOptionChange('all')} className={currentOption === 'all' ? 'active' : ''}>
          All Programs
        </button>
        <button id="FSD" onClick={() => handleOptionChange('FSD')} className={currentOption === 'FSD' ? 'active' : ''}>
          Fellowship Program in Software Development
        </button>
        <button id="QA" onClick={() => handleOptionChange('QA')} className={currentOption === 'QA' ? 'active' : ''}>
          Fellowship Program in QA Automation
        </button>
        <div id="filterContainer">
          <select id="tagFilter" value={filterTag} onChange={(e) => handleFilterChange(e.target.value)}>
            <option value="all">All Tags</option>
            {['Premium', 'Advanced', 'Engagement/DNP', 'Post Nurture Engagement', 'Pre Nurture Engagement', 'Educative', 'User Asked'].map(tag => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
          <button id="resetFilter" onClick={() => handleFilterChange('all')}>Reset</button>
        </div>
      </div>
      <div id="tableContainer">
        <table>
          <thead>
            <tr>
              <th><center>Creative Assets</center></th>
              <th><center>Message</center></th>
              <th><center>Use Case</center></th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, index) => (
              <tr key={index}>
                <td
                  className="hover-container"
                  onMouseMove={(e) => handleMouseMove(e, 'Click to view')}
                  onMouseLeave={handleMouseLeave}
                >
                  <img src={row.image} alt={row.imageName} onClick={() => showModal(row.image, row.imageName)} />
                  {tooltip.visible && (
                    <span
                      className="tooltip"
                      style={{ top: tooltip.y + 10, left: tooltip.x + 10 }}
                    >
                      {tooltip.content}
                    </span>
                  )}
                </td>
                <td
                  className="copy-content"
                  onMouseMove={(e) => handleMouseMove(e, 'Click to copy')}
                  onMouseLeave={handleMouseLeave}
                  onClick={(e) => handleCopyContent(e, row.content, row.contentName)}
                >
                  <span className="content-text" data-content-name={row.contentName} dangerouslySetInnerHTML={{ __html: row.content }}></span>
                  {tooltip.visible && (
                    <span
                      className="tooltip"
                      style={{ top: tooltip.y + 10, left: tooltip.x + 10 }}
                    >
                      {tooltip.content}
                    </span>
                  )}
                </td>
                <td>{row.tags.join(', ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {modalData.isOpen && (
        <div id="imageModal" className="modal open" onClick={closeModal}>
          <span id="closeModal" className="close" onClick={closeModal}>&times;</span>
          <a
            id="downloadLink"
            href={modalData.imageSrc}
            download={modalData.imageName}
            onClick={(e) => handleDownloadImage(e, modalData.imageSrc, modalData.imageName)}
          >
            <img className="modal-content" id="modalImage" src={modalData.imageSrc} alt={modalData.imageName} />
          </a>
        </div>
      )}
    </div>
  );
}

export default App;
