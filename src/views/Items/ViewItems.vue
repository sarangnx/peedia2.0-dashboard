<template>
    <div class="card shadow">
        <div  class="card-header d-flex justify-content-between">
            <h3>Items</h3>
            <div>
                <!-- FILTER BY LOCALBODY -->
                <base-button size="sm" v-if="pageLoading && isAdmin"><i class="ni ni-settings-gear-65 spin"></i></base-button>
                <base-dropdown v-else-if="localbodies.length && isAdmin" position="right" class="mb-2 mb-md-0">
                    <base-button slot="title" type="primary" class="dropdown-toggle" size="sm">
                        {{ selectedLocalbody ? selectedLocalbody.name : 'Panchayath or Municipality' }}
                    </base-button>
                    <a class="dropdown-item text-black" @click="selectedLocalbody = null">All</a>
                    <a class="dropdown-item text-black"
                        v-for="(localbody, index) in localbodies"
                        :key="index"
                        @click="selectedLocalbody = Object.assign({}, localbody)"
                    >
                        {{ localbody.name }}
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
            </div> <!-- Filter -->
        </div> <!-- Card Header -->
        <div class="card-body d-flex flex-row justify-content-start flex-wrap p-2">
            <div
                v-for="(item, index) of items"
                :key="item.item_id"
                class="col-md-4 mb-2 p-1 border-0"
            >
                <div class="card shadow h-100">
                    <div class="card-header border-0 d-flex justify-content-center">
                        <img v-if="item.image_path" :src="`${baseUrl}/images/inventory/${item.image_path}`" class="item-image">
                        <i v-else class="ni ni-image ni-5x"></i> <!-- Alt Image -->
                    </div>
                    <div class="card-body d-flex justify-content-end flex-column">
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
                        <div v-if="item.market_price">
                            <h4 class="inline m-0 pr-2">Market Price:</h4>
                            <span>{{ parseFloat(item.market_price) }}</span>
                        </div>
                        <div v-if="item.offer_price">
                            <h4 class="inline m-0 pr-2">Offer Price:</h4>
                            <span>{{ parseFloat(item.offer_price) }}</span>
                        </div>
                    </div>
                    <div class="card-footer d-flex justify-content-end">
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
            </div>
            <div class="over__lay" v-if="pageLoading">
                <loading color="dark"/>
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
            <div class="container">
                <edit-item :item_id="editID" :edit="editModal" @close-edit="closeEdit()"></edit-item>
            </div>
        </modal>
        <div class="card-footer">
            <base-pagination
                :page-count="total_pages"
                v-model="page"
                align="center">
                </base-pagination>
        </div>
    </div>
</template>
<script>
import EditItem from './EditItem';

export default {
    name: 'view-items',
    components: {
        EditItem,
    },
    data: () => ({
        items: [],
        count: 0, // item count
        page: 1, // current page
        total_pages: 0, // page count
        per_page: 12,
        pageLoading: false, // during pagination & filter
        categories: {},
        category: {
            name: 'All',
            id: 0
        }, // selected category
        deleteID: null, // ID of item to be deleted.
        deleteIndex: null, // Index of item to be deleted.
        deleteModal: false,
        editModal: false,
        editID: null,
        localbodies: [],
        activeLocalbodies: [],
        selectedLocalbody: null,
    }),
    computed: {
        isAdmin() {
            const usergroup = this.$store.getters.getUser.usergroup;
            if(usergroup === 'admin' || usergroup === 'superadmin'){
                return true;
            }
            return false;
        },
        storeId() {
            const user = this.$store.getters.getUser;
            if( user.store && user.store.length ){
                return user.store[0].store_id;
            }
            else {
                return null;
            }
        },
        baseUrl() {
            // base url of api server where images are uploaded.
            return this.$store.getters.serverUrl;
        },
    },
    watch: {
        category() {

            if( !this.category.id ){
                this.getAllItems(this.page, this.per_page);
                return;
            }

            // reset page number
            // this also triggers getItemsByCategoryID request.
            this.page = 1;

            this.getItemsByCategory({
                category_id: this.category.id,
                page: this.page,
                per_page: this.per_page,
                recursive: true,
            });
        },
        page() {
            if( this.category.name === 'All' ){
                this.getAllItems(this.page, this.per_page);
            } else {
                this.getItemsByCategory({
                    category_id: this.category.id,
                    page: this.page,
                    per_page: this.per_page,
                    recursive: true,
                });
            }
        },
        selectedLocalbody() {
            this.reloadData();
        }
    },
    methods: {
        getItemsByCategory({category_id, page, per_page, recursive}) {
            this.pageLoading = true;
            let store_id = this.storeId;

            if(this.isAdmin && this.selectedLocalbody && this.selectedLocalbody.store_id) {
                store_id = this.selectedLocalbody.store_id;
            } else if( this.isAdmin && this.selectedLocalbody ) {
                this.$set(this.items, []);

                this.total_pages = 0;
                this.page = 1;
                this.count = 0;
                this.pageLoading = false;
                return;
            }

            this.$axios({
                method: 'get',
                url: '/inventory/items/category',
                params: {
                    category_id,
                    page,
                    per_page,
                    recursive,
                    store_id,
                }
            }).then((response) => {
                const data = response.data.data;
                this.items = data.items;

                this.total_pages = data.total_pages;
                this.page = data.current_page;
                this.count = data.total;

                // Initialize array
                this.modals = Array.from({length: this.count}, () => false);
            }).finally(() => {
                this.pageLoading = false;
            });
        },
        getAllItems(page, per_page = 12){
            this.pageLoading = true;
            let store_id = this.storeId;

            if(this.isAdmin && this.selectedLocalbody && this.selectedLocalbody.store_id) {
                store_id = this.selectedLocalbody.store_id;
            } else if( this.isAdmin && this.selectedLocalbody ) {
                this.$set(this.items, []);

                this.total_pages = 0;
                this.page = 1;
                this.count = 0;
                this.pageLoading = false;
                return;
            }

            this.$axios({
                method: 'get',
                url: '/inventory/items/all',
                params: {
                    page,
                    per_page,
                    store_id,
                }
            }).then((response) => {
                const data = response.data.data;
                this.items = data.items;

                this.total_pages = data.total_pages;
                this.page = data.current_page;
                this.count = data.total;

                // Initialize array
                this.modals = Array.from({length: this.count}, () => false);
            }).finally(() => {
                this.pageLoading = false;
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
        deleteItem() {
            const item_id = this.deleteID;
            const index = this.deleteIndex;

            // send delete request
            this.$axios({
                method: 'delete',
                url: `/inventory/item/${item_id}`
            }).then((response) => {
                if (response.data && response.data.status === "success") {
                    this.$success('Item Deleted.');

                    // Delete the item from the array.
                    this.items.splice(index, 1);

                } else {
                    this.$error('Item not deleted.');
                }
            }).catch(() => {
                this.$error('Item not deleted.');
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
        reloadData() {
            // reload data.
            if( this.category.name === 'All' ){
                this.getAllItems(this.page, this.per_page);
            } else {
                this.getItemsByCategory({
                    category_id: this.category.id,
                    page: this.page,
                    per_page: this.per_page,
                    recursive: true,
                });
            }
        },
        listLocalbodies() {
            this.$axios({
                method: 'get',
                url: '/localbodies/list',
            }).then((response) => {
                const localbodies = response.data.localbodies;

                this.localbodies = localbodies.rows;
            });
        },
    },
    mounted(){
        this.listLocalbodies();
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
