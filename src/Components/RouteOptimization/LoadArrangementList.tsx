import React from 'react';
import { Box, Typography } from '@mui/material';

interface LoadArrangementListProps {
    loadArrangement: { stop: number; location: string; packages: string[] }[];
    selectedStop: string | null;
    onStopClick: (location: string) => void;
}

const LoadArrangementList: React.FC<LoadArrangementListProps> = ({ loadArrangement, selectedStop, onStopClick }) => {
    return (
        <div>
            <h1 style={{ color: '#F08C24', fontSize: '24px', fontWeight: 'bold', textDecorationLine: 'underline' }}>
                LoadArrangement
            </h1>
            {[...loadArrangement].reverse().map((stop, index) => (
                <Box
                    key={index}
                    sx={{
                        padding: 1,
                        border: '1px solid #ccc',
                        marginBottom: 1,
                        backgroundColor: selectedStop === stop.location ? '#F08C24' : 'transparent',
                        color: selectedStop === stop.location ? '#fff' : '#000',
                        cursor: 'pointer',
                    }}
                    onClick={() => onStopClick(stop.location)}
                >
                    <strong>Stop {index + 1}</strong>: {stop.location}
                </Box>
            ))}
        </div>
    );
};

export default LoadArrangementList;
