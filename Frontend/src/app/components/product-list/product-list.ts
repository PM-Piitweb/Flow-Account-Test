import { Component, signal, ChangeDetectorRef  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators,FormBuilder } from '@angular/forms';
import { FormsModule } from '@angular/forms'; 

export interface Product {
  id: number;
  name: string;
  sku: string;
  price: number;
  stock: number;
  category: 'อาหาร' | 'เครื่องดื่ม' | 'ของใช้' | 'เสื้อผ้า';
  createdAt: Date;
}

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './product-list.html',
  styleUrls: ['./product-list.css']
})
export class ProductList {
  
  products: Product[] = [
    { id: 1, name: 'ข้าวผัด', sku: 'P001', price: 45, stock: 20, category: 'อาหาร', createdAt: new Date() },
    { id: 2, name: 'น้ำส้ม', sku: 'P002', price: 25, stock: 50, category: 'เครื่องดื่ม', createdAt: new Date() },
    { id: 3, name: 'สบู่', sku: 'P003', price: 35, stock: 0, category: 'ของใช้', createdAt: new Date() },
    { id: 4, name: 'เสื้อยืด', sku: 'P004', price: 299, stock: 5, category: 'เสื้อผ้า', createdAt: new Date() },
    { id: 5, name: 'กาแฟ', sku: 'P005', price: 55, stock: 8, category: 'เครื่องดื่ม', createdAt: new Date() },
  ];

  selectedCategory = signal('ทั้งหมด');
  categories: string[] = ['ทั้งหมด', 'อาหาร', 'เครื่องดื่ม', 'ของใช้', 'เสื้อผ้า'];

  
toastMessage = '';
  toastVisible = false;

 

  showToast(message: string) {
    this.toastMessage = message;
    this.toastVisible = true;
    this.cd.detectChanges(); 

    setTimeout(() => {
      this.toastVisible = false;
      this.cd.detectChanges();
    }, 1000);
  }

  addForm = new FormGroup({
  name: new FormControl<string>('', [Validators.required, Validators.minLength(3)]),
  sku: new FormControl<string>('', [Validators.required]),
  price: new FormControl<number | null>(null, [Validators.required, Validators.min(0.01)]),
  stock: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
  category: new FormControl<string>('อาหาร', [Validators.required])
});


  isLowStock(stock: number) {
    return stock > 0 && stock < 10;
  }

  isOutOfStock(stock: number) {
    return stock === 0;
  }

  sellProduct(product: Product) {
  if (product.stock > 0) {
    product.stock--;
    this.showToast(`ขายสินค้า "${product.name}" สำเร็จ! คงเหลือ ${product.stock} ชิ้น`);
  } else {
    this.showToast(`สินค้า "${product.name}" หมดแล้ว! ไม่สามารถขายได้`);
  }
}

  getFilteredProducts() {
    if (this.selectedCategory() === 'ทั้งหมด') return this.products;
    return this.products.filter(p => p.category === this.selectedCategory());
  }

  getTotalValue(): number {
    return this.getFilteredProducts().reduce((sum, p) => sum + p.price * p.stock, 0);
  }

  getTotalCount(): number {
    return this.getFilteredProducts().length;
  }

isModalOpen = false;
isEditMode = false;
editingProduct: Product | null = null;
submitAttempted = false;


// Form Group เดียวสำหรับ Add/Edit
constructor(private cd: ChangeDetectorRef, private fb: FormBuilder) {
  // สร้าง productForm หลังจาก inject fb
  this.productForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    sku: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0.01)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    category: ['', Validators.required]
  });
}

productForm: FormGroup;



// เปิด modal เพิ่มสินค้า
openAddModal() {
  this.isModalOpen = true;
  this.isEditMode = false;
  this.editingProduct = null;
  this.submitAttempted = false;
  this.productForm.reset();
}

// เปิด modal แก้ไขสินค้า
openEditModal(product: Product) {
  this.isModalOpen = true;
  this.isEditMode = true;
  this.editingProduct = product;
  this.submitAttempted = false;
  this.productForm.patchValue({...product});
}

// ปิด modal
closeModal() {
  this.isModalOpen = false;
}

// ตรวจสอบ SKU ซ้ำ
skuExists(value: string, currentId?: number): boolean {
  return this.products.some(p => p.sku === value && p.id !== currentId);
}

// Submit สำหรับ Add/Edit
onSubmit() {
  this.submitAttempted = true;
  if (this.productForm.invalid || this.skuExists(this.productForm.get('sku')?.value, this.editingProduct?.id)) {
    return;
  }

  if (this.isEditMode && this.editingProduct) {
    // แก้ไขสินค้า
    const index = this.products.findIndex(p => p.id === this.editingProduct!.id);
    this.products[index] = {...this.editingProduct, ...this.productForm.value};
    this.showToast('แก้ไขสินค้าเรียบร้อยแล้ว');
  } else {
    // เพิ่มสินค้า
    const newProduct = {...this.productForm.value, id: Date.now()};
    this.products.push(newProduct);
    this.showToast('เพิ่มสินค้าเรียบร้อยแล้ว');
  }

  this.closeModal();
}


  deleteProduct(product: Product) {
  this.showConfirmModal(`คุณต้องการลบสินค้า "${product.name}" หรือไม่?`, () => {
    this.products = this.products.filter(p => p.id !== product.id);
    this.showToast(`ลบสินค้า "${product.name}" เรียบร้อยแล้ว`);
  });
}

confirmVisible = false;
confirmMessage = '';
confirmCallback: (() => void) | null = null;

showConfirmModal(message: string, callback: () => void) {
  this.confirmMessage = message;
  this.confirmCallback = callback;
  this.confirmVisible = true;
}

confirmYes() {
  if (this.confirmCallback) this.confirmCallback();
  this.confirmVisible = false;
  this.confirmCallback = null;
}

confirmNo() {
  this.confirmVisible = false;
  this.confirmCallback = null;
}
}
