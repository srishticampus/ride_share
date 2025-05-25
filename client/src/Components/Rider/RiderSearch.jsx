import { Box, TextField, InputAdornment , IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

function RiderSearch({ searchQuery, setSearchQuery }) {
  return (
    <Box sx={{ width: '270px' }}>
      <TextField
        fullWidth
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        variant="outlined"
        sx={{
            backgroundColor: '#f5f5f5',
            '& .MuiOutlinedInput-root': {
              borderRadius: '50px',
              height:'50px'
            },
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton><SearchIcon color="action" /></IconButton>
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
}
export default RiderSearch;