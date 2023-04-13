import React from 'react';
import styled from '@emotion/styled';
import { TitleBar } from '../../lib';
import { Box, CircularProgress, FormControl, InputAdornment, InputLabel, MenuItem, OutlinedInput, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import { Search } from '@mui/icons-material';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

interface ProductProps {
  _id: string;
  name: string;
  productCode: string;
  description: string;
  brand: string;
  category: string;
  subcategory: string;
  pricing: {
    cost: string;
    retail: string | number;
  };
  inStock?: boolean;
  isActive?: boolean;
  imgUrl?: string;
  expiryDate?: string;
  createdAt?: string;
  modifiedAt?: string;
  quantity: number;
  orderQty: number;
}


const Store = () => {
	const [search, setSearch] = React.useState<string>("");
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value);
	
	const [loading, setLoading] = React.useState<boolean>(false);
	const [error, setError] = React.useState<any>(null);
	const token: string | null = localStorage.getItem("token");
  const fetchFn = async (): Promise<any> => {
    // setLoading(true);
    const config = {
      url: "products",
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Headers": "*",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await axios.request(config);
      if (response.status === 200 || response.status === 201)
        return response.data;
    } catch (error) {
      console.log(error);
      setError(error);
    }
  };

  const { data, refetch } = useQuery({
    queryKey: ["products"],
    queryFn: fetchFn,
    keepPreviousData: true,
    cacheTime: 600000,
    staleTime: 600000,
    networkMode: "offlineFirst",
  });

	React.useEffect(() => {
		refetch();
	}, []);

	const [item, setItem] = React.useState<ProductProps | null>(null)
	const selectProduct = (e: React.MouseEvent<HTMLElement>, val: ProductProps) => {
		setItem(val);
    // if (e.detail === 2) openItemModal();
  };

	return (
		<React.Fragment>
			<TitleBar text="Store" />
			<Container>
				<Box sx={{ display: 'flex', gap: 4, justifyContent: 'space-between' }}>
					<FormControl variant="outlined" size="small">
						<InputLabel htmlFor="outlined-adornment-search">Search</InputLabel>
						<OutlinedInput
							id="outlined-adornment-search"
							endAdornment={<InputAdornment position="end"><Search sx={{ cursor: 'pointer' }} /></InputAdornment>}
							label="Search"
							onChange={handleChange}
							value={search}
						/>
					</FormControl>
					{/* <TextField select size="small" label="Filter by">
						<MenuItem></MenuItem>
					</TextField> */}
				</Box>
				<Box sx={{ height: "calc(100vh - 250px)" }}>
					{data ? (
						<TableContainer component={Box} sx={{ maxHeight: "calc(100vh - 149px)", mt: 2 }}>
							<Table sx={{ minWidth: 750 }} aria-label="products table" size="small" stickyHeader>
								<TableHead>
									<TableRow>
										<TableCell sx={{ backgroundColor: 'rgba(0, 0, 0, 0.2)', fontWeight: 700, paddingLeft: 1 }}>Product Description</TableCell>
										<TableCell sx={{ backgroundColor: 'rgba(0, 0, 0, 0.2)', fontWeight: 700 }}>Product Brand</TableCell>
										<TableCell sx={{ backgroundColor: 'rgba(0, 0, 0, 0.2)', fontWeight: 700 }}>Product Category</TableCell>
										<TableCell sx={{ backgroundColor: 'rgba(0, 0, 0, 0.2)', fontWeight: 700 }} align="center">Quantity</TableCell>
										<TableCell sx={{ backgroundColor: 'rgba(0, 0, 0, 0.2)', fontWeight: 700 }} align="right">Cost</TableCell>
										<TableCell sx={{ backgroundColor: 'rgba(0, 0, 0, 0.2)', fontWeight: 700, paddingRight: 1 }} align="right">Price</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{[...data?.data]
										.filter((product: ProductProps) => product.isActive)
										.sort((a, b) => a.name.localeCompare(b.name))
										.filter((product: ProductProps) => {
											if (search.trim() === "") return product;
											if (product.name.toLowerCase().includes(search.trim().toLowerCase())) return product;
											if (product.productCode.toString().toLowerCase().includes(search.trim().toLowerCase())) return product;
											if (product.brand.toLowerCase().includes(search.trim().toLowerCase())) return product;
											if (product.category.toLowerCase().includes(search.trim().toLowerCase())) return product;
										})
										.map((product: ProductProps) => (
											<TableRow
												key={product.name}
												sx={{
													"&:hover": {backgroundColor: "rgba(0,0,0,0.07)", cursor: "pointer"},
													backgroundColor: product?._id === item?._id ? "rgba(0,0,0,0.07)" : "",
												}}
												onClick={(e) => selectProduct(e, product)}
											>
												<TableCell sx={{ padding: '0.75rem 0 0.75rem 0.5rem' }} scope="row">{product.name}</TableCell>
												<TableCell scope="row">{product.brand}</TableCell>
												<TableCell scope="row">{product.category}</TableCell>
												<TableCell align="center">{product.quantity ? product.quantity : 0}</TableCell>
												<TableCell align="right">{Number(product.pricing.cost).toLocaleString()}</TableCell>
												<TableCell sx={{ paddingRight: 0 }} align="right">{Number(product.pricing.retail).toLocaleString()}</TableCell>
											</TableRow>
										))}
								</TableBody>
							</Table>
						</TableContainer>
					) : loading ? (
						<Box sx={{ height: "100%", display: "grid", placeItems: "center" }}>
							<CircularProgress size="5rem" />
						</Box>
					) : (
						error && (
							<Box sx={{ height: "100%", display: "grid", placeItems: "center", width: '100%' }}>
								<Typography variant="h5" color="error">
									Error {error?.response?.status}:{" "} {JSON.stringify(error, null)}
								</Typography>
							</Box>
						)
					)}
				</Box>
			</Container>
		</React.Fragment>
	)
}

export default Store;

const Container = styled.div``;
