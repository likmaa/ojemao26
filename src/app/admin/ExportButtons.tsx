'use client';

import { FaDownload } from 'react-icons/fa';

interface ExportButtonsProps {
  debatData: any[];
  cifData: any[];
  deleguesData: any[];
}

export default function ExportButtons({ debatData, cifData, deleguesData }: ExportButtonsProps) {

  const downloadCSV = (data: any[], filename: string) => {
    if (data.length === 0) {
      alert("Aucune donnée à exporter.");
      return;
    }

    // Get headers
    const headers = Object.keys(data[0]).join(',');
    
    // Get rows
    const rows = data.map(row => {
      return Object.values(row).map(value => {
        const stringValue = String(value);
        // Escape quotes and wrap in quotes if contains comma
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      }).join(',');
    });

    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
      <button 
        onClick={() => downloadCSV(debatData, 'inscriptions_debat')}
        style={styles.btn}
        title="Télécharger Inscrits Débat (CSV)"
      >
        <FaDownload style={{ marginRight: '0.4rem' }} /> CSV Débat
      </button>
      <button 
        onClick={() => downloadCSV(cifData, 'inscriptions_cif')}
        style={styles.btn}
        title="Télécharger Inscrits CIF (CSV)"
      >
        <FaDownload style={{ marginRight: '0.4rem' }} /> CSV CIF
      </button>
      <button 
        onClick={() => downloadCSV(deleguesData, 'recensement_delegues')}
        style={styles.btn}
        title="Télécharger Délégués (CSV)"
      >
        <FaDownload style={{ marginRight: '0.4rem' }} /> CSV Délégués
      </button>
    </div>
  );
}

const styles = {
  btn: {
    padding: '0.5rem 1rem',
    backgroundColor: '#FFFFFF',
    border: '1px solid #E2E8F0',
    borderRadius: '4px',
    fontSize: '0.8rem',
    fontWeight: '600',
    color: 'var(--text-dark)',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  }
};
