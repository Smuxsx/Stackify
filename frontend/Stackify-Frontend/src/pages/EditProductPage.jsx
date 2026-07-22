import {useNavigate, Link, useParams} from "react-router"
import {useAuth} from "@clerk/react"
import { useProductById, useUpdateProduct } from "../hooks/useProduct"
import LoadsingSpinner from "../components/LoadingSpinner.jsx"
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import EditProductForm from "../components/EditProductForm.jsx";

function EditProductPage() {
  const { id } = useParams();
  const { isLoaded, userId} = useAuth();
  const navigate = useNavigate();

  const {data: product, isLoading} = useProductById(id);
  const updateProduct = useUpdateProduct();

  if (isLoading) return <LoadingSpinner />

  if(!product || product.userId !== userId){
    return (
      <div className="card bg-base-300 max-w-md mx-auto">
        <div className="card-body items-center text-center">
          <h2 className="card-title text-error">{!product ? "Not found" : "Access Denied"}</h2>
          <Link to="/" className="btn btn-primary btn-sm"> Go home</Link>
        </div>
      </div>
    )
  }

  return (
    <EditProductForm 
      product={product}
      isPending={updateProduct.isPending}
      isError={updateProduct.isError}
      onSubmit = {(formData) => {
        updateProduct.mutate({id, ...formData}, {onSuccess: () => navigate(`/product/${id}`)})
      }}
    />
  )
}

export default EditProductPage