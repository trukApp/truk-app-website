import React from 'react'
import { DataGridComponent } from './GridComponent';
import { GridColDef } from '@mui/x-data-grid';
import { Grid } from '@mui/material';

const weightUnitsData = [
  { id: 1, unit: 'Kilogram', abbreviation: 'kg', equivalentInGrams: 1000 },
  { id: 2, unit: 'Pound', abbreviation: 'lb', equivalentInGrams: 453.592 },
  { id: 3, unit: 'Ounce', abbreviation: 'oz', equivalentInGrams: 28.3495 },
  { id: 4, unit: 'Ton', abbreviation: 't', equivalentInGrams: 1000000 },
  { id: 5, unit: 'Gram', abbreviation: 'g', equivalentInGrams: 1 },
];

const weightColumns: GridColDef[] = [
  { field: 'unit', headerName: 'Unit', width: 200 },
  { field: 'abbreviation', headerName: 'Abbreviation', width: 150 },
  { field: 'equivalentInGrams', headerName: 'Equivalent in Grams', width: 200 },
];


const jewelWeightsData = [
  { id: 1, unit: 'Carat', abbreviation: 'ct', equivalentInGrams: 0.2 },
  { id: 2, unit: 'Milligram', abbreviation: 'mg', equivalentInGrams: 0.001 },
  { id: 3, unit: 'Tola', abbreviation: 'tola', equivalentInGrams: 11.6638 },
  { id: 4, unit: 'Baht', abbreviation: 'baht', equivalentInGrams: 15.244 },
  { id: 5, unit: 'Gram', abbreviation: 'g', equivalentInGrams: 1 },
];

const jewelcolumns: GridColDef[] = [
  { field: 'unit', headerName: 'Unit', width: 200 },
  { field: 'abbreviation', headerName: 'Abbreviation', width: 150 },
  { field: 'equivalentInGrams', headerName: 'Equivalent in Grams', width: 200 },
];


const liquidUnitsData = [
  { id: 1, unit: 'Liter', abbreviation: 'L', equivalentInMilliliters: 1000 },
  { id: 2, unit: 'Milliliter', abbreviation: 'mL', equivalentInMilliliters: 1 },
  { id: 3, unit: 'Gallon (US)', abbreviation: 'gal', equivalentInMilliliters: 3785.41 },
  { id: 4, unit: 'Pint (US)', abbreviation: 'pt', equivalentInMilliliters: 473.176 },
  { id: 5, unit: 'Fluid Ounce (US)', abbreviation: 'fl oz', equivalentInMilliliters: 29.5735 },
];


const columnsForLiquids: GridColDef[] = [
  { field: 'unit', headerName: 'Unit', width: 200 },
  { field: 'abbreviation', headerName: 'Abbreviation', width: 150 },
  { field: 'equivalentInMilliliters', headerName: 'Equivalent in Milliliters', width: 200 },
];



const UnitsOfMeasurement = () => {
  return (
    <div>
      <Grid item xs={12} style={{ marginTop: '50px' }}>
        <DataGridComponent
          columns={weightColumns}
          rows={weightUnitsData}
          isLoading={false}
          pageSizeOptions={[10, 20]}
          initialPageSize={10}
        />
      </Grid>

      <Grid item xs={12} style={{ marginTop: '50px' }}>
        <DataGridComponent
          columns={jewelcolumns}
          rows={jewelWeightsData}
          isLoading={false}
          pageSizeOptions={[10, 20]}
          initialPageSize={10}
        />
      </Grid>

      <Grid item xs={12} style={{ marginTop: '50px' }}>
        <DataGridComponent
          columns={columnsForLiquids}
          rows={liquidUnitsData}
          isLoading={false}
          pageSizeOptions={[10, 20]}
          initialPageSize={10}
        />
      </Grid>
    </div>
  )
}

export default UnitsOfMeasurement
