<template>
    <div class="container">
        <div class="row">
            <div class="col-12">
                <span class="badge badge-primary mr-2">Banner Position</span>
                <span class="badge badge-success">{{ banner_order }}</span>
            </div>
            <div class="col-12">
                <label class="form-control-label">Banner Name</label>
                <base-input v-model="banner_name"></base-input>
            </div>
            <div class="col-12">
                <label class="form-control-label">Offer</label>
                <div v-if="selected.offer_id" class="selected d-flex justify-content-between align-items-center">
                    <div>
                        <span class="pr-3">{{ selected.offer_name }}</span>
                        <span v-if="selected.offer_status" class="badge badge-success">
                            Active
                        </span>
                        <span v-else class="badge badge-danger">
                            Inactive
                        </span>
                    </div>
                    <base-button type="danger" size="sm" icon="fa fa-times" @click="clearSelected()"></base-button>
                </div>
                <input v-else @keyup="suggest()" ref="suggest" class="form-control">
                <div v-if="searchDropdown" class="search-container">
                    <div class="search-results">
                        <span class="px-2 py-1 text-muted">Search results</span>
                        <a class="px-2 py-1 d-flex justify-content-between align-items-center"
                            v-for="(item, index) in offers"
                            :key="item.offer_id"
                            @click="selectItem(index)"
                        >
                            <span class="pl-3">{{ item.offer_name }}</span>
                            <span v-if="item.offer_status" class="badge badge-success">
                                Active
                            </span>
                            <span v-else class="badge badge-danger">
                                Inactive
                            </span>
                        </a>
                    </div>
                </div>
            </div>
            <div class="col-12 mt-3">
                <label class="form-control-label">Banner Image</label>
                <div class="row">
                    <div v-if="image" class="col-12 col-md-6 mt-5">
                        <vue-cropper
                            ref="cropper"
                            :aspect-ratio="15 / 7"
                            :src="image"
                            :viewMode="2"
                            dragMode="move"
                        ></vue-cropper>
                        <div class="mt-2 d-flex justify-content-between">
                            <base-button icon="fa fa-trash-alt" type="danger"
                                @click="removeImage()"
                            ></base-button>
                            <base-button icon="fa fa-crop" type="success"
                                @click="crop()"
                            >Crop & Select</base-button>
                        </div>
                    </div>
                    <div class="col-12 col-md-6 mt-5" v-show="croppedImage">
                        <h3>Preview</h3>
                        <img ref="preview" src="#" class="preview">
                    </div>
                </div>
                <div v-if="!image" class="col-12">
                    <input type="file" ref="file" @change="loadImage($event)" class="hidden"/>
                    <base-button type="success" icon="fa fa-camera" @click="openImage()">
                        <span class="text-white">Select Banner Image</span>
                    </base-button>
                </div>
            </div>
            <div class="col-12 mt-5 ">
                <base-button icon="fa fa-plus" type="primary" @click="addBanner()">Add Banner</base-button>
            </div>
        </div>
    </div>
</template>
<script>
import VueCropper from 'vue-cropperjs';
import 'cropperjs/dist/cropper.css';

export default {
    name: 'add-banner',
    components: {
        VueCropper
    },
    data: () => ({
        banner_name: '',
        selected: {},
        searchDropdown: false,
        debounce: null, // for debounced search
        offers: [],
        image: null,
        croppedImage: null,
        filename: null,
    }),
    props: {
        banner_order: {
            type: [Number, String]
        },
        visibility: {
            type: Boolean,
            default: false
        }
    },
    watch: {
        visibility() {
            if( this.visibility === false || this.banner_order === null ){
                this.image = null;
                this.croppedImage = null;
                this.banner_name = '';
                this.filename = null;
                this.selected = Object.assign({}, {});
                return;
            }
        },
    },
    methods: {
        suggest() {
            clearTimeout(this.debounce);

            const self = this;

            // send server request only when user stops typing.
            this.debounce = setTimeout(() => {
                const search = self.$refs.suggest.value;

                if(search === ''){
                    this.searchDropdown = false;
                    return;
                }

                self.$axios({
                    method: 'get',
                    url: '/api/offers/suggest',
                    params: {
                        search: search,
                    }
                }).then((response) => {
                    const data = response.data.data;

                    this.offers = data.offers;
                    this.count = data.count;
                    this.searchDropdown = true;
                });

            }, 700);
        },
        selectItem(index) {
            this.selected = Object.assign({}, this.offers[index]);
            this.searchDropdown = false;
        },
        clearSelected() {
            this.selected = Object.assign({}, {});
        },
        openImage() {
            // open the file selector.
            this.$refs.file.click();
        },
        loadImage(event) {

            if(event.target.files[0]){

                this.filename = event.target.files[0].name;

                let reader = new FileReader();

                reader.onload = (e) => {
                    this.image = e.target.result;
                    // Replace image and rebuild cropper.
                    if(this.$refs.cropper){
                        this.$refs.cropper.replace(e.target.result);
                    }
                };

                reader.readAsDataURL(event.target.files[0]);
                
            }
        },
        removeImage() {
            // remove selected image from buffer and data property of vue.
            this.image = null;
            this.croppedImage = null;
            this.filename = null;
        },
        crop() {
            this.croppedImage = this.$refs.cropper.getCroppedCanvas().toDataURL();
            this.$refs.preview.setAttribute('src', this.croppedImage);
        },
        addBanner() {

            // Convert base64 image to File to send to server as formdata.
            let arr = this.croppedImage.split(','),
                mime = arr[0].match(/:(.*?);/)[1],
                bstr = atob(arr[1]),
                n = bstr.length,
                u8arr = new Uint8Array(n);

            while(n--){
                u8arr[n] = bstr.charCodeAt(n);
            }
            const image = new File([u8arr], this.filename, {type:mime});

            const data = {
                banner_name: this.banner_name,
                banner_order: this.banner_order,
                offer_id: this.selected.offer_id,
                image: image
            };

            if(!data.image || !data.banner_name) {
                this.$notify({
                    title: 'Validation Error',
                    type: 'danger',
                    message: 'Banner Name and Banner Image required.'
                });
                return;
            }

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
                method: "post",
                url: `/api/banners/new`,
                headers: {
                    "Content-Type": "multipart/form-data"
                },
                data: formdata
            }).then((response) => {
                if (response.data && response.data.status === "success") {

                    // Reset item and image on successful upload.
                    this.image = null;
                    this.croppedImage = null;
                    this.banner_name = '';
                    this.filename = null;
                    this.selected = Object.assign({}, {});

                    this.$notify({
                        type: "success",
                        title: "Success",
                        message: "Banner Added."
                    });
                    this.$emit('close-modal');
                } else {
                    this.$notify({
                        type: "danger",
                        title: "Something went Wrong!",
                        message: "Banner could not be Added."
                    });
                }
            }).catch(() => {
                this.$notify({
                    type: "danger",
                    title: "Something went Wrong.",
                    message: "Banner could not be Added."
                });
            });
        }
    }
};
</script>
<style scoped>
.search-container {
    position: relative;
    width: 100%;
}
.search-results {
    position: absolute;
    z-index: 1000;
    background: white;
    width: 100%;
    box-shadow: 0px 3px 5px -2px black;
    max-height: 200px;
    overflow: hidden;
    padding: 10px;
}
.search-results:hover{
    overflow-y: auto;
}
/* --- Scrollbar --- */
.search-results::-webkit-scrollbar {
    width: 6px;
}
.search-results::-webkit-scrollbar-track {
    background: transparent;
}
.search-results::-webkit-scrollbar-thumb {
    background: #43c2ff;
}
.search-results::-webkit-scrollbar-thumb:hover {
    background: #004fff;
}

.search-results > span {
    display: block
}
.search-results > a {
    display: block;
    cursor: pointer;
}
.search-results > a:hover {
    background: #e8e8e8;
}

.selected {
    padding: 15px;
    border: 1px solid #d7d7d7;
    border-radius: 10px;
}

.hidden {
    display: none;
}

.preview {
    max-width: 100%;
}
</style>
