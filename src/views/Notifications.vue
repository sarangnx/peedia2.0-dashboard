<template>
    <div>
        <base-header type="gradient-success" class="pb-6 pb-8 pt-5 pt-md-8">
        </base-header>
        <div class="container-fluid mt--7">
            <div class="row">
                <div class="col-12">
                    <div class="card shadow">
                        <div  class="card-header d-flex justify-content-between">
                            <h3>Send Notifications</h3>
                        </div>
                        <div class="card-body">
                            <div class="col-12">
                                <label class="form-control-label">Notification Title</label>
                                <base-input v-model="notif_title" placeholder="Keep it very short!"></base-input>
                            </div>
                            <div class="col-12">
                                <label class="form-control-label">Notification Body</label>
                                <base-input v-model="notif_body"
                                    placeholder="Limit to 1 or 2 sentences."
                                ></base-input>
                            </div>
                            <div class="col-12 mt-3">
                                <base-button icon="fas fa-paper-plane" type="success"
                                    v-if="!loading"
                                    @click="sendNotification"
                                    block
                                >
                                    Send Notification
                                </base-button>
                                <base-button icon="fas fa-circle-notch fa-spin" type="success"
                                    v-else
                                    block
                                    disabled
                                ></base-button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'notifications',
    data: () => ({
        notif_title: '',
        notif_body: '',
        loading: false
    }),
    methods: {
        sendNotification() {
            this.loading = true;

            const data = {
                notif_title: this.notif_title,
                notif_body: this.notif_body,
            }

            this.$axios({
                method: 'post',
                url: '/notifications/send',
                data: data
            }).then((response) => {
                if(response.data && response.data.status === 'success'){

                    this.$notify({
                        type: 'success',
                        title: 'Success',
                        message: 'Notifications sent successfully'
                    });

                    this.loading = false;
                    this.notif_title = '';
                    this.notif_body = '';
                }
            }).catch(() => {
                
                this.$notify({
                    type: 'danger',
                    title: 'Something went wrong!',
                    message: 'Notification not sent'
                });
                this.loading = false;
            });

        },
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
</style>
