import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Box,
  CircularProgress,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import styled from "@emotion/styled";
import { Add, ShoppingCartCheckoutOutlined } from "@mui/icons-material";
import { setCartModal, setItemModal } from "../../store/modals";
import { connect } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import Cart from "./Cart";
import AddItemModal from "./AddItemModal";

interface ShopProps {
  cartModal: boolean;
  openCartModal: () => void;
  closeCartModal: () => void;
	selectItemModal: boolean;
	openItemModal: () => void;
	closeItemModal: () => void;
}

interface TitleProps {
  text: string;
}

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

interface CartItemProps {
  _id: string;
  name: string;
  productCode: string;
  description: string;
  brand: string;
  category: string;
  subcategory?: string;
  pricing: {
    cost: string;
    retail: string | number;
  };
  quantity: number;
  orderQty: number;
}

const Shop = (props: ShopProps) => {
  const { cartModal, openCartModal, closeCartModal, openItemModal, closeItemModal, selectItemModal } = props;

  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<any>(null);
  const [item, setItem] = React.useState<CartItemProps | null>(null);

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

  // search
  const [search, setSearch] = React.useState<string>("");
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSearch(e.target.value);

  const ColTitle = (props: TitleProps) => {
    return <Typography variant="h6" fontSize="1rem">{props.text}</Typography>
  };
  const CellContent = (props: TitleProps) => {
    return <Typography>{props.text}</Typography>;
  };

  // page title
  React.useEffect((): (() => void) => {
    document.title = "Shop: Overwatch";
    return () => null;
  }, []);

  // cart management
  let cartStorage = localStorage.getItem("cart");
  const [cart, setCart] = React.useState<Array<CartItemProps>>(() => cartStorage ? JSON.parse(cartStorage) : []);
  let tempCart: CartItemProps[] | null = [];
  cart.forEach((item) => tempCart?.push(item));

  const selectProduct = (e: React.MouseEvent<HTMLElement>, val: ProductProps) => {
    const { createdAt, expiryDate, modifiedAt, inStock, isActive, imgUrl, subcategory, ...rest } = val;
		setItem(rest);
    // console.log(rest);
    if (e.detail === 2) openItemModal();
  };
	
	const openProductModal = (e: React.MouseEvent<HTMLElement>, val: ProductProps) => {
		selectProduct(e, val);
		openItemModal();
	}

  // cart item count
  const [count, setCount] = React.useState<number>(0);
  React.useEffect(() => {
    let totalCount = 0;
    cart.forEach((item) => {
      totalCount += item?.orderQty;
    });
    setCount(totalCount);
  }, [cart]);

  // refetch on first render
  React.useEffect(() => {
    refetch();
  }, []);

  return (
    <Box>
      <TopBar>
        <TextField
          size="small"
          variant="outlined"
          label="Search"
          name="search"
          value={search}
          onChange={handleChange}
          autoFocus
        />
        <Box
          onClick={openCartModal}
          sx={{ position: "relative", left: -15, cursor: "pointer" }}
        >
          <ShoppingCartCheckoutOutlined sx={{ color: "teal" }} />
          <Count>{count}</Count>
        </Box>
      </TopBar>
      <Box sx={{ height: "calc(100vh - 149px)" }}>
        {data ? (
          <TableContainer component={Box}>
            <Table sx={{ minWidth: 750 }} aria-label="products table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Product Description</TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="center">Quantity</TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="right">Price</TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="center">Add</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[...data?.data]
                  .filter((products: ProductProps) => products.quantity)
                  .filter((product: ProductProps) => product.isActive)
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .filter((item: ProductProps) => {
                    if (search.trim() === "") return item;
                    if (item.name.toLowerCase().includes(search.trim().toLowerCase())) return item;
                    if (item.productCode.toString().toLowerCase().includes(search.trim().toLowerCase())) return item;
                    if (item.brand.toLowerCase().includes(search.trim().toLowerCase())) return item;
                    if (item.category.toLowerCase().includes(search.trim().toLowerCase())) return item;
                  })
                  .map((product: ProductProps) => (
                    <TableRow
                      key={product.name}
                      sx={{
                        "&:hover": {backgroundColor: "rgba(0,0,0,0.1)", cursor: "pointer"},
                        backgroundColor: product?._id === item?._id ? "rgba(0,0,0,0.06)" : "",
                      }}
                      onClick={(e) => selectProduct(e, product)}
                    >
                      <TableCell component="th" scope="row">
                        {product.name}
                      </TableCell>
                      <TableCell align="center">{product.quantity}</TableCell>
                      <TableCell align="right">
                        {Number(product.pricing.retail).toLocaleString()}
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Add item to cart" placement="top">
													<IconButton size="small" sx={{ background: "#354F5220" }} onClick={e => openProductModal(e, product)}><Add /></IconButton>
                        </Tooltip>
                      </TableCell>
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
      <React.Fragment>
        {cartModal && (
          <Cart open={cartModal} close={closeCartModal} cart={cart} setCart={setCart} refetch={refetch} />
        )}
      </React.Fragment>
			<React.Fragment>
				{
					selectItemModal && <AddItemModal open={selectItemModal} close={closeItemModal} tempCart={tempCart} currentItem={item} setCart={setCart} cart={cart} />
				}
			</React.Fragment>
    </Box>
  );
};

const mapStateToProps = (state: { modals: { selectItemModal: boolean; cartModal: boolean; }; }) => {
  return {
    cartModal: state.modals.cartModal,
		selectItemModal: state.modals.selectItemModal
  };
};

const mapDispatchToProps = (dispatch: (arg0: { payload: any; type: "modals/setCartModal" | "modals/setItemModal" }) => any) => {
  return {
    openCartModal: () => dispatch(setCartModal(true)),
    closeCartModal: () => dispatch(setCartModal(false)),
		openItemModal: () => dispatch(setItemModal(true)),
		closeItemModal: () => dispatch(setItemModal(false)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Shop);

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  width: 100%;
`;

const Count = styled.span`
	position: absolute;
	top: -30%;
	right: -80%;
	font-size: 10;
	background-color: teal;
	color: #FFFFFF;
	height: 1.25rem;
	width: 1.25rem;
	border-radius: 50%;
	display: grid;
	place-items: center;
`;
