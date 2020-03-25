<template>
<div>
    <div class="row align-items-center mb-3">
        <div class="col">
            <h1 class="mb-0">Add Item</h1>
        </div>
    </div>
    <div class="row">
        <div class="col-12">
            <h3>Product Name</h3>
        </div>
        <div class="col-12 px-0">
            <base-input v-model="item.item_name" class="col-12 col-md-6" maxlength="200"></base-input>
        </div>
        <div class="col-12">
            <h3>Base Quantity</h3>
        </div>
        <base-input v-model="item.quantity" label="Quantity" class="col-6" type="number" min="1"></base-input>

        <div class="form-group col-6">
            <label class="form-control-label">Unit</label>
            <select v-model="item.unit" class="custom-select mr-sm-2">
                <option>kg</option>
                <option>g</option>
                <option>l</option>
                <option>ml</option>
                <option>count</option>
            </select>
        </div>
        <div class="col-12">
            <h3>Price</h3>
        </div>
        <base-input v-model="item.market_price" class="col-6"></base-input>

        <div class="col-12">
            <h3>Category</h3>
        </div>

        <!-- CATEGORY -->
        <div class="form-group col-12 col-md-6">
            <select
                v-model="item.category_id"
                class="custom-select mr-sm-2"
                @change="item.sub_category_id = 0;item.sub_sub_category_id = 0;"
            >
                <option selected="selected" :value="0">None</option>
                <option
                    v-for="category in categories"
                    :key="category.category_id"
                    :value="category.category_id"
                >
                    {{category.category_name}}
                </option>
            </select>
        </div>
        <!-- CATEGORY -->

        <div class="col-12">
            <h3>Product Image</h3>
        </div>
        <div class="form-group col-12">
            <div class="input-group">
                <div class="custom-file">
                    <input type="file" ref="file" @change="loadImage($event)" class="custom-file-input" />
                    <label class="custom-file-label" ref="image">Product Image</label>
                </div>
                <div class="input-group-append">
                    <base-button 
                        type="danger"
                        icon="ni ni-lg ni-fat-remove"
                        @click.prevent="removeImage()"
                    >
                    </base-button>
                </div>
            </div>
        </div>

        <div class="form-group col">
            <base-button
                type="success"
                icon="ni ni-cloud-upload-96"
                @click.prevent.stop="upload()"
            >Add Item</base-button>
        </div>
    </div>
</div>
</template>
<script>
export default {
    name: "add-item",
    data: () => ({
        item: {
            category_id: 0,
        },
        categories: [],
    }),
    computed: {
        storeId() {
            return this.$store.getters.getUser.store[0].store_id;
        },
    },
    methods: {
        getAllCategories() {
            // return if already loaded.
            if (Object.entries(this.categories).length !== 0) {
                return;
            }

            // Get list of all categories and sub categories
            this.$axios({
                method: 'get',
                url: '/inventory/categories/all',
            }).then((response) => {
                // assign to this.categories.
                this.categories = response.data.data.categories;
            });
        },
        loadImage(event) {
            this.item.image = event.target.files[0];
            if(event.target.files[0]){
                this.$refs.image.innerHTML = event.target.files[0].name;
            } else {
                this.$refs.image.innerHTML = 'Product Image';
            }
        },
        removeImage(){
            // remove selected image from buffer and data property of vue.
            // and set label to default.
            this.item.image = null;
            this.$refs.file.value = this.$refs.file.defaultValue;
            this.$refs.image.innerHTML = 'Product Image';
        },
        upload() {

            const data = this.item;

            // remove keys with null or undefined or 0 value.
            for (let key in data) {
                if(!data[key]) {
                    delete data[key];
                }
            }

            // Wrap it as formdata.
            const formdata = new FormData();
            Object.keys(data).forEach(key => {
                formdata.append(key, data[key]);
            });

            this.$axios({
                method: 'post',
                url: `/inventory/store/${this.storeId}`,
                headers: {
                    "Content-Type": "multipart/form-data"
                },
                data: formdata
            }).then((response) => {
                if (response.data && response.data.status === "success") {

                    // Reset item and image on successful upload.
                    this.item = null;
                    this.item = {
                        category_id: 0,
                    };

                    // remove selected image
                    this.removeImage();

                    this.$notify({
                        type: "success",
                        title: "Success",
                        message: "Item Added to Inventory"
                    });
                } else {
                    this.$notify({
                        type: "danger",
                        title: "Something went Wrong",
                        message: "Item not Added to Inventory"
                    });
                }
            }).catch(() => {
                this.$notify({
                    type: "danger",
                    title: "Something went Wrong",
                    message: "Item not Added to Inventory"
                });
            });
        }
    },
    mounted() {
        // load category
        this.getAllCategories();
    }
};
</script>
