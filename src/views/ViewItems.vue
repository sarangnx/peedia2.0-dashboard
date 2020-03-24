<template>
    <div>
        <base-header type="gradient-success" class="pb-6 pb-8 pt-5 pt-md-8">
        </base-header>
        <div class="container-fluid mt--7">
            <div class="row">
                <div class="col-12">
                    <div class="card shadow">
                        <div  class="card-header d-flex justify-content-between">
                            <h3>Items</h3>
                            <div>
                                <span class="pr-3">Filter</span>
                                <base-dropdown position="right">
                                    <base-button slot="title" type="success" class="dropdown-toggle" size="sm">
                                        {{ outOfStock ? 'Out Of Stock': 'All' }}
                                    </base-button>
                                    <a class="dropdown-item"
                                        @click.stop="outOfStock = false"
                                    >
                                        All
                                    </a>
                                    <a class="dropdown-item"
                                        @click.stop="outOfStock = true"
                                    >
                                        Out Of Stock
                                    </a>
                                </base-dropdown>
                                <base-button size="sm" v-if="pageLoading"><i class="ni ni-settings-gear-65 spin"></i></base-button>
                                <base-dropdown v-else position="right">
                                    <base-button slot="title" type="primary" class="dropdown-toggle" size="sm">
                                        {{ category.name }}
                                    </base-button>
                                    <a class="dropdown-item"
                                        @click.stop="category={ 
                                            name: 'All',
                                            id: 0
                                        }"
                                    >
                                        All
                                    </a>
                                    <a class="dropdown-item"
                                        v-for="item in categories"
                                        :key="item.category_id"
                                        @click.stop="category={ 
                                            name: item.category_name,
                                            id: item.category_id
                                        }"
                                    >
                                        {{ item.category_name }}
                                    </a>
                                </base-dropdown>
                                <base-dropdown v-if="category.id" position="right">
                                    <base-button slot="title" type="primary" class="dropdown-toggle" size="sm">
                                        {{ subCategory.name }}
                                    </base-button>
                                    <a class="dropdown-item"
                                        @click.stop="subCategory={
                                            name: 'All',
                                            id: 0
                                        }"
                                    >
                                        All
                                    </a>
                                    <a class="dropdown-item"
                                        v-for="item in subCategories[category.id]"
                                        :key="item.sub_category_id"
                                        @click.stop="subCategory={
                                            name: item.sub_category_name,
                                            id: item.sub_category_id
                                        }"
                                    >
                                        {{ item.sub_category_name }}
                                    </a>
                                </base-dropdown>
                                <base-dropdown v-if="subCategory.id" position="right">
                                    <base-button slot="title" type="primary" class="dropdown-toggle" size="sm">
                                        {{ subSubCategory.name }}
                                    </base-button>
                                    <a class="dropdown-item"
                                        @click.stop="subSubCategory={
                                            name: 'All',
                                            id: 0
                                        }"
                                    >
                                        All
                                    </a>
                                    <a class="dropdown-item"
                                        v-for="item in subSubCategories[subCategory.id]"
                                        :key="item.sub_sub_category_id"
                                        @click.stop="subSubCategory={
                                            name: item.sub_sub_category_name,
                                            id: item.sub_sub_category_id
                                        }"
                                    >
                                        {{ item.sub_sub_category_name }}
                                    </a>
                                </base-dropdown>
                            </div> <!-- Filter -->
                        </div> <!-- Card Header -->
                        <div class="card-body d-flex flex-row justify-content-start flex-wrap">
                            <div
                                v-for="(item, index) of items"
                                :key="item.item_id"
                                class="card col-md-4 mb-2 p-1"
                            >
                                <span v-if="item.total_stock" :class="['badge', `badge-${badgeClass(item.total_stock.available)}`]" >{{ item.total_stock.message }}</span>
                                <div class="card-header d-flex justify-content-center">
                                    <img v-if="item.image_path" :src="`${baseUrl}/images/inventory/${item.image_path}`" class="item-image">
                                    <i v-else class="ni ni-image ni-5x"></i> <!-- Alt Image -->
                                </div>
                                <div class="card-body">
                                    <div>
                                        <h4 class="inline m-0 pr-2">Product Name:</h4>
                                        <span>{{ item.item_name }}</span>
                                    </div>
                                    <div>
                                        <h4 class="inline m-0 pr-2">Quantity:</h4>
                                        <span>{{ parseFloat(item.quantity) }}</span>
                                    </div>
                                    <div>
                                        <h4 class="inline m-0 pr-2">Unit:</h4>
                                        <span>{{ item.unit }}</span>
                                    </div>
                                    <div>
                                        <h4 class="inline m-0 pr-2">Market Price:</h4>
                                        <span>{{ parseFloat(item.market_price) }}</span>
                                    </div>
                                    <div v-if="item.offer_price">
                                        <h4 class="inline m-0 pr-2">Offer Price:</h4>
                                        <span>{{ parseFloat(item.offer_price) }}</span>
                                    </div>
                                    <div v-if="item.total_stock" :class="['badge', `badge-${badgeClass(item.total_stock.available)}`]">
                                        <h5 class="inline m-0 pr-2 text-capitalize">Stocks:</h5>
                                        <span class="mr-1">{{ parseFloat(item.total_stock.quantity) }}</span>
                                        <span>{{ item.total_stock.unit }}</span>
                                    </div>
                                </div>
                                <div class="card-footer d-flex justify-content-end">
                                    <base-button size="sm" type="success"
                                        @click="stockItemID = item.item_id; stockModal = true"
                                    >
                                        Manage Stocks
                                    </base-button>

                                    <base-button size="sm" type="danger"
                                        @click="deleteID = item.item_id; deleteModal = true; deleteIndex = index"
                                    >
                                        Delete
                                    </base-button>

                                    <base-button size="sm" type="primary"
                                        @click="editID = item.item_id; editModal = true"
                                    >
                                        Edit
                                    </base-button>
                                </div>
                            </div>
                        </div> <!-- outer card body -->
                        <!-- Delete Modal -->
                        <modal :show.sync="deleteModal" gradient="danger">
                            <template slot="header">
                                <h5 class="modal-title">Delete Item</h5>
                            </template>
                            <div class="py-1 text-center">
                                <h4 class="heading mt-4">Are you sure you want to delete this item?</h4>
                                <p class="text-white">This action cannot be reverted.</p>
                            </div>
                            <template slot="footer">
                                <base-button type="white"
                                    @click="deleteItem()"
                                >
                                    Ok, Delete
                                </base-button>
                                <base-button type="link"
                                    text-color="white"
                                    class="ml-auto"
                                    @click="deleteID = null; deleteModal = false; deleteIndex = null"
                                >
                                    Close
                                </base-button>
                            </template>
                        </modal> <!-- Delete Modal -->
                        <!-- Edit Modal -->
                        <modal :show.sync="editModal">
                            <template slot="header">
                                <h1 class="modal-title">Edit Item</h1>
                            </template>
                            <edit-item :item_id="editID" :edit="editModal" @close-edit="closeEdit()"></edit-item>
                        </modal>
                        <!-- stocks modal -->
                        <modal :show.sync="stockModal" modalClasses="modal-xl">
                            <template slot="header">
                                <h1 class="modal-title">Stocks</h1>
                            </template>
                            <template slot="close-button">
                                <base-button
                                    @click="closeStocks()"
                                    icon="fa fa-times"
                                    size="sm"
                                    type="danger"
                                >
                                </base-button>
                            </template>
                            <stocks :item_id="stockItemID" :modal="stockModal" @close-stock="stockItemID = null; stockModal = false"></stocks>
                        </modal>
                        <div class="card-footer">
                            <base-pagination 
                                :page-count="total_pages"
                                v-model="page"
                                align="center">
                            </base-pagination>
                        </div>
                    </div> <!-- outer card -->
                </div>
            </div> <!-- row -->            
        </div>
    </div>       
</template>
<script>
import EditItem from './Items/EditItem';
import Stocks from './Items/Stocks';

export default {
    name: 'view-items',
    components: {
        EditItem,
        Stocks,
    },
    data: () => ({
        items: [],
        count: 0, // item count
        page: 1, // current page
        total_pages: 0, // page count
        per_page: 12,
        pageLoading: false, // during pagination & filter
        categories: {},
        subCategories: {},
        subSubCategories: {},
        category: {
            name: 'All',
            id: 0
        }, // selected category
        subCategory: {
            name: 'All',
            id: 0
        }, // selected sub category
        subSubCategory: {
            name: 'All',
            id: 0
        }, // selected sub sub category,
        outOfStock: false,
        deleteID: null, // ID of item to be deleted.
        deleteIndex: null, // Index of item to be deleted.
        deleteModal: false,
        editModal: false,
        editID: null,
        stockModal: false,
        stockItemID: null
    }),
    computed: {
        storeId() {
            return this.$store.getters.getUser.store[0].store_id;
        },
        baseUrl() {
            // base url of api server where images are uploaded.
            return this.$store.getters.apiUrl;
        },
    },
    watch: {
        category() {
            // clear sub category
            this.subCategory = {
                name: 'All',
                id: 0
            };
            // get sub categories
            this.getSubCategories(this.category.id);

            if( !this.category.id ){
                this.getAllItems(this.page, this.per_page, this.outOfStock);
                return;
            }

            // reset page number
            // this also triggers getItemsByCategoryID request.
            this.page = 1;

            this.getItemsByCategory({
                category_id: this.category.id,
                page: this.page,
                per_page: this.per_page,
                stock: this.outOfStock
            });
        },
        subCategory() {
            // clear sub sub category
            this.subSubCategory = {
                name: 'All',
                id: 0
            }

            // reset page number
            // this also triggers getItemsByCategoryID request.
            this.page = 1;

            // exit if 'all' is selected in sub catgeory or category
            if( !this.category.id || !this.subCategory.id ){
                return
            }

            // get sub sub categories
            this.getSubSubCategories(this.subCategory.id);

            this.getItemsByCategory({
                category_id: this.category.id,
                sub_category_id: this.subCategory.id || null,
                page: this.page,
                per_page: this.per_page,
                stock: this.outOfStock
            });

        },
        subSubCategory() {

            // exit if 'all' is selected in category or sub catgeory or sub sub category
            if( !this.category.id || !this.subCategory.id || !this.subSubCategory.id){
                return
            }

            // reset page number
            // this also triggers getItemsByCategoryID request.
            this.page = 1;

            this.getItemsByCategory({
                category_id: this.category.id,
                sub_category_id: this.subCategory.id || null,
                sub_sub_category_id: this.subSubCategory.id || null,
                page: this.page,
                per_page: this.per_page,
                stock: this.outOfStock
            });
        },
        page() {
            if( this.category.name === 'All' ){
                this.getAllItems(this.page, this.per_page, this.outOfStock);
            } else {
                this.getItemsByCategory({
                    category_id: this.category.id,
                    sub_category_id: this.subCategory.id || null,
                    sub_sub_category_id: this.subSubCategory.id || null,
                    page: this.page,
                    per_page: this.per_page,
                    stock: this.outOfStock
                });
            }
        },
        outOfStock() {
            // Reset page number
            this.page = 1;

            if( this.category.name === 'All' ){
                this.getAllItems(this.page, this.per_page, this.outOfStock);
            } else {
                this.getItemsByCategory({
                    category_id: this.category.id,
                    sub_category_id: this.subCategory.id || null,
                    sub_sub_category_id: this.subSubCategory.id || null,
                    page: this.page,
                    per_page: this.per_page,
                    stock: this.outOfStock
                });
            }
        }

    },
    methods: {
        getItemsByCategory({category_id, sub_category_id, sub_sub_category_id, page, per_page, stock}) {
            this.$axios({
                method: 'get',
                url: '/inventory/items/category',
                params: {
                    category_id,
                    sub_category_id,
                    sub_sub_category_id,
                    page,
                    per_page,
                    stock
                }
            }).then((response) => {
                const data = response.data.data;
                this.items = data.items;

                this.total_pages = data.total_pages;
                this.page = data.current_page;
                this.count = data.total;

                // Initialize array
                this.modals = Array.from({length: this.count}, () => false);
            });
        },
        getAllItems(page, per_page = 12, stock = false){

            this.$axios({
                method: 'get',
                url: '/inventory/items/all',
                params: {
                    page,
                    per_page,
                    stock
                }
            }).then((response) => {
                const data = response.data.data;
                this.items = data.items;

                this.total_pages = data.total_pages;
                this.page = data.current_page;
                this.count = data.total;

                // Initialize array
                this.modals = Array.from({length: this.count}, () => false);
            });

        },
        getCategories() {

            // return if already loaded.
            if (Object.entries(this.categories).length !== 0) {
                return;
            }

            // Get list of categories for drop down list
            this.$axios({
                method: 'get',
                url: "/inventory/categories"
            }).then((response) => {
                if (response.data.status === "success") {
                    this.categories = Object.assign({}, this.categories, response.data.data.categories);
                }
            });

        },
        getSubCategories(category_id) {

            // return if already loaded.
            if (this.subCategories[category_id] || category_id === '') {
                return;
            }

            // Get list of sub categories for drop down list
            this.$axios({
                method: 'get',
                url: `/inventory/subcategory/${category_id}`
            }).then((response) => {
                if (response.data.status === "success") {
                    // vue cannot track changes when values are assigned directly.
                    this.subCategories = Object.assign({}, this.subCategories, {
                        [category_id]: response.data.data.sub_categories
                    });
                }
            });

        },
        getSubSubCategories(sub_category_id) {

            // return if already loaded.
            if (this.subSubCategories[sub_category_id] || sub_category_id === '') {
                return;
            }

            // Get list of sub categories for drop down list
            this.$axios({
                method: 'get',
                url: `/inventory/subsubcategory/${sub_category_id}`
            }).then((response) => {
                if (response.data.status === "success") {
                    this.subSubCategories = Object.assign({}, this.subSubCategories, {
                        [sub_category_id]: response.data.data.sub_sub_categories
                    });
                }
            });

        },
        deleteItem() {

            const item_id = this.deleteID;
            const index = this.deleteIndex;

            // send delete request
            this.$axios({
                method: 'delete',
                url: `/inventory/item/${item_id}`
            }).then((response) => {
                if (response.data && response.data.status === "success") {
                    this.$notify({
                        type: "success",
                        title: "Success",
                        message: "Item Deleted."
                    });

                    // Delete the item from the array.
                    this.items.splice(index, 1);

                } else {
                    this.$notify({
                        type: "danger",
                        title: "Something went Wrong!",
                        message: "Item not deleted."
                    });
                }
            }).catch(() => {
                this.$notify({
                    type: "danger",
                    title: "Something went Wrong!",
                    message: "Item not deleted."
                });
            }).finally(() => {
                this.deleteID = null;
                this.deleteModal = false;
                this.deleteIndex = null;
            });
        },
        closeEdit() {
            this.editModal = false;
            this.editID = null;

            this.reloadData();
        },
        closeStocks() {
            this.stockModal = false;
            this.stockItemID = null;

            this.reloadData();
        },
        reloadData() {
            // reload data.
            if( this.category.name === 'All' ){
                this.getAllItems(this.page, this.per_page, this.outOfStock);
            } else {
                this.getItemsByCategory({
                    category_id: this.category.id,
                    sub_category_id: this.subCategory.id || null,
                    sub_sub_category_id: this.subSubCategory.id || null,
                    page: this.page,
                    per_page: this.per_page
                });
            }
        },
        badgeClass(available) {
            if(available){
                return 'success'
            } else {
                return 'danger'
            }
        },
    },
    mounted(){
        this.getAllItems();
        this.getCategories();
    }
};
</script>
<style scoped>
.item-image {
    max-width: 100%;
    height: 150px;
}
.inline {
    display: inline;
}
</style>
