import ProductExperience from "@/components/product/product-experience";
import { ProductSections } from "@/components/product/sections/product-sections";
import { SiteHeader } from "@/components/product/site-header";
import { ProductStoreProvider } from "@/components/product/store/product-store-provider";
export default function Home() {
  return (
    <ProductStoreProvider>
      <SiteHeader />
      <ProductExperience>
        <ProductSections />
      </ProductExperience>
    </ProductStoreProvider>
  );
}
