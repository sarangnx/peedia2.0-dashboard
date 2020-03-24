<template>
    <div class="container">
        <div class="row align-items-center mb-3">
            <div class="col d-flex justify-content-between align-items-baseline">
                <h1>{{ heading }}</h1>
                <base-button
                    icon="fa fa-redo"
                    rounded size="sm" iconOnly
                    @click="refresh"
                ></base-button>
            </div>
            <div class="table-responsive col-12">
                <base-table
                    :data="offers"
                    type="hover table-striped table-sm"
                    class="table"
                >
                    <template slot="columns">
                        <th class="text-left">Offer Name</th>
                        <th>Offer Description</th>
                        <th v-if="status === 'all'">Status</th>
                        <th>Discount %</th>
                        <th>Items</th>
                        <th>Actions</th>
                    </template>
                    <template slot-scope="{row}">
                        <td class="max-width">
                            {{ row.offer_name }}
                        </td>
                        <td class="max-width">
                            {{ row.offer_description }}
                        </td>
                        <td v-if="status === 'all'" class="text-center">
                            <span v-if="row.offer_status === true"
                                class="badge badge-success"
                            >
                                Active
                            </span>
                            <span v-if="row.offer_status === false"
                                class="badge badge-danger"
                            >
                                Inactive
                            </span>
                        </td>
                        <td>
                            {{ row.discount_percentage }}
                        </td>
                        <td>
                            <div 
                                v-for="item in row.items"
                                :key="item.item_id"
                                class="item-container"
                            >
                                <img v-if="item.image_path" 
                                    :src="`${baseUrl}/images/inventory/${item.image_path}`" 
                                    class="item-image"
                                >
                                <i v-else class="ni ni-image"></i> <!-- Alt Image -->
                                <span class="pl-3">{{ item.item_name }}</span>
                            </div>
                        </td>
                        <td>
                            <base-button size="sm" type="primary"
                                icon="fa fa-edit"
                                title="Edit"
                            >
                            </base-button>
                            <base-button size="sm" type="danger"
                                v-if="status === 'active'"
                                icon="fa fa-times-circle"
                                title="Deactivate offer. Resets all offer prices."
                                @click="deactivateOffer(row.offer_id)"
                            >
                            </base-button>
                            <base-button size="sm" type="danger"
                                v-if="status === 'all'"
                                icon="fa fa-trash-alt"
                                title="Deletes Offer. Resets all offer prices."
                                @click="deleteID = row.offer_id; deleteModal = true"
                            >
                            </base-button>
                        </td>
                    </template>
                </base-table>
            </div>
            <div class="p-3 col-12">
                <base-pagination 
                    :page-count="total_pages"
                    v-model="page"
                    align="center"
                >
                </base-pagination>
            </div>
        </div>
        <!-- Delete Modal -->
        <modal :show.sync="deleteModal" gradient="danger">
            <template slot="header">
                <h5 class="modal-title">Delete Offer</h5>
            </template>
            <div class="py-1 text-center">
                <h4 class="heading mt-4 text-white">Are you sure you want to delete this offer?</h4>
                <p class="text-white">This action cannot be reverted.</p>
            </div>
            <template slot="footer">
                <base-button type="white"
                    @click="deleteOffer()"
                >
                    Ok, Delete
                </base-button>
                <base-button type="link"
                    text-color="white"
                    class="ml-auto"
                    @click="deleteID = null; deleteModal = false;"
                >
                    Close
                </base-button>
            </template>
        </modal> <!-- Delete Modal -->
    </div>
</template>
<script>
export default {
    name: 'view-offers',
    props: {
        status: {
            type: String,
            default: 'active',
            validator: (value) => {
                return ['active', 'inactive', 'all'].indexOf(value) !== -1;
            }
        }
    },
    data: () => ({
        offers: [],
        count: 0,
        total_pages: 0,
        page: 1,
        per_page: 10,
        deleteID: null,
        deleteModal: false
    }),
    computed: {
        heading() {
            switch(this.status){
                case 'active': return 'Active Offers';
                case 'inactive': return 'Expired Offers';
                case 'all': return 'Offer History';
            }
        },
        baseUrl() {
            // base url of api server where images are uploaded.
            return this.$store.getters.apiUrl;
        },
    },
    watch: {
        page() {
            this.getOffers(this.page, this.per_page);
        }
    },
    methods: {
        getOffers(page, per_page) {
            this.$axios({
                method: 'get',
                url: '/api/offers/view',
                params: {
                    status: this.status,
                    page,
                    per_page
                }
            }).then((response) => {
                if( response.data.status === 'success' ){
                    let data = response.data.data;
                    this.offers = data.offers;
                    this.count = data.count;
                    this.total_pages = data.total_pages;
                }
            });
        },
        refresh() {
            // Refresh and go back to page 1
            this.page === 1 ? this.getOffers(this.page, this.per_page) : this.page = 1;
        },
        deactivateOffer(offer_id) {

            this.$axios({
                method: 'patch',
                url: '/api/offers/deactivate',
                params: {
                    offer_id
                }
            }).then((response) => {
                if( response.data.status === 'success' ){
                    this.$notify({
                        type: 'success',
                        title: 'Success',
                        message: 'Offer Deactivated.'
                    });
                }

                // Refresh Page
                this.getOffers(this.page, this.per_page);

            }).catch(() => {
                this.$notify({
                    type: 'danger',
                    title: 'Error',
                    message: 'Offer Not Deactivated. Try Again!'
                });
            });

        },
        deleteOffer() {

            this.$axios({
                method: 'delete',
                url: '/api/offers/delete',
                params: {
                    offer_id: this.deleteID
                }
            }).then((response) => {
                if( response.data.status === 'success' ){
                    this.$notify({
                        type: 'success',
                        title: 'Success',
                        message: 'Offer Deleted.'
                    });
                }

                // Refresh Page
                this.deleteID = null;
                this.deleteModal = false;
                this.getOffers(this.page, this.per_page);

            }).catch(() => {
                this.$notify({
                    type: 'danger',
                    title: 'Error',
                    message: 'Offer Not Deleted. Try Again!'
                });
            }).finally(() => {
                this.deleteID = null;
                this.deleteModal = false;
            });

        }
    },
    mounted() {
        this.getOffers(this.page, this.per_page);
    }
};
</script>
<style scoped>
.max-width {
    white-space: normal;
    overflow-x: hidden;
}
.item-image {
    height: 20px;
}
.item-container {
    display: flex;
}
</style>