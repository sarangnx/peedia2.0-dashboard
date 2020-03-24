<template>
    <div class="container">
        <div class="d-flex align-items-stretch flex-wrap">
            <div v-for="(banner, index) in banners" :key="banner.banner_order" class="col-12 col-md-4 mb-3">
                <div class="card shadow p-3 full">
                    <div v-if="banner.banner_id" class="banner-container">
                        <img :src="`${baseUrl}/images/banners/${banner.banner_image}`" class="banner-image">
                        <h3>
                            {{ banner.banner_name }}
                        </h3>
                        <div v-if="banner.offer">
                            <h6>Offer</h6>
                            <span class="pr-3">{{ banner.offer.offer_name }}</span>
                            <span v-if="banner.offer.offer_status" class="badge badge-success">
                                Active
                            </span>
                            <span v-else class="badge badge-danger">
                                Inactive
                            </span>
                        </div>
                        <div class="banner-overlay">
                            <div class="d-flex justify-content-center align-items-center full">
                                <base-button type="danger" icon="fa fa-trash-alt"
                                    @click="deleteID = banner.banner_id; deleteModal = true;deleteIndex = index"
                                >
                                </base-button>
                            </div>
                        </div>
                    </div>
                    <div v-else class="full d-flex align-items-center justify-content-center">
                        <base-button icon="fa fa-plus" type="primary"
                            @click="addBannerModal = true;addBannerOrder = index + 1;"
                        ></base-button>
                    </div>
                </div>
            </div>
        </div>
        <!-- Delete Modal -->
        <modal :show.sync="deleteModal" gradient="danger">
            <template slot="header">
                <h5 class="modal-title">Delete Banner</h5>
            </template>
            <div class="py-1 text-center">
                <h4 class="heading mt-4 text-white">Are you sure you want to delete this banner?</h4>
                <p class="text-light">This action cannot be reverted.</p>
            </div>
            <template slot="footer">
                <base-button type="white"
                    @click="deleteBanner()"
                >
                    Ok, Delete
                </base-button>
                <base-button type="link"
                    text-color="white"
                    class="ml-auto"
                    @click="deleteID = null; deleteModal = false;deleteIndex = null;"
                >
                    Close
                </base-button>
            </template>
        </modal> <!-- Delete Modal -->
        <modal :show.sync="addBannerModal" modalClasses="modal-xl">
            <template slot="header">
                <h1 class="modal-title">Add Banner</h1>
            </template>
            <template slot="close-button">
                <base-button
                    @click="addBannerModal = false;addBannerOrder = null;"
                    icon="fa fa-times"
                    size="sm"
                    type="danger"
                >
                </base-button>
            </template>
            <add-banner :banner_order="addBannerOrder" 
                :visibility="addBannerModal"
                @close-modal="closeAdd()"
            >
            </add-banner>
        </modal>
    </div>
</template>
<script>
import AddBanner from './AddBanner';

export default {
    name: 'view-banners',
    components: {
        AddBanner
    },
    data: () => ({
        limit: 5,
        banners: [],
        count: 0,
        deleteID: null,
        deleteModal: false,
        deleteIndex: null,
        addBannerModal: false,
        addBannerOrder: null,
    }),
    computed: {
        baseUrl() {
            // base url of api server where images are uploaded.
            return this.$store.getters.apiUrl;
        },
    },
    methods: {
        getAllBanners() {

            this.$axios({
                method: 'get',
                url: '/api/banners/all'
            }).then((response) => {
                const data = response.data.data;

                // create an array of length limit
                this.banners = Array.from({ length: this.limit }, (_, i) => ({ banner_order: i + 1 }));
                data.banners.forEach((banner) => {
                    this.banners[banner.banner_order - 1] = Object.assign({}, banner);
                });
                this.count = data.count;
            });

        },
        deleteBanner() {
            const banner_id = this.deleteID;
            const index = this.deleteIndex;

            // send delete request
            this.$axios({
                method: 'delete',
                url: `/api/banners/${banner_id}`
            }).then((response) => {
                if (response.data && response.data.status === "success") {
                    this.$notify({
                        type: "success",
                        title: "Success",
                        message: "Banner Deleted."
                    });

                    // Delete the item from the array.
                    this.banners[index] = Object.assign({}, { banner_order: index + 1 });
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
        closeAdd() {
            this.addBannerModal = false;
            this.addBannerOrder = null;
            this.getAllBanners();    
        }
    },
    mounted() {
        this.getAllBanners();
    }
};
</script>
<style scoped>
.banner-image {
    width: 100%
}
.full {
    height: 100%;
    width: 100%;
}

.banner-overlay {
    cursor: pointer;
}
.banner-container .banner-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: none;
    color: white;
}
.banner-container:hover .banner-overlay {
    display: block;
    background: rgba(0,0,0,0.4);
}
</style>
