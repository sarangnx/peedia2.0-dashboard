<template>
    <div class="row justify-content-center">
        <div class="col-lg-5 col-md-7">
            <div class="card bg-secondary shadow border-0">
                <div class="card-body px-lg-5 py-lg-5">
                    <div class="text-center text-muted mb-4">Reset Password</div>
                    <form role="form" method="post" action="#" @submit.prevent="login">
                        <base-input
                            class="input-group-alternative mb-3"
                            placeholder="Email"
                            addon-left-icon="ni ni-email-83"
                            v-model="username"
                        ></base-input>
                        <div class="text-center">
                            <base-button type="primary" class="my-4" @click.prevent="sendOtp">Send OTP</base-button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: "reset",
    data: () => ({
        username: null,
    }),
    methods: {
        sendOtp() {
            const username = this.username;

            this.$axios({
                method: 'post',
                baseURL: process.env.VUE_APP_API_URL,
                url: `/auth/forgot`,
                data: {
                    username,
                }
            }).then((response) => {
                if (response.data && response.data.status === "success") {
                    this.$success('OTP Sent to email');
                } else {
                    throw new Error('Unable to send email.');
                }
            }).catch(() => {
                this.$error('Unable to send email.');
            });
        }
    }
};
</script>
