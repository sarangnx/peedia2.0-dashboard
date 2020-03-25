<template>
    <div>
        <base-header type="gradient-success" class="pb-6 pb-8 pt-5 pt-md-8">
        </base-header>
        <div class="container-fluid mt--7">
            <div class="row">
                <div class="col-12">
                    <div class="card shadow">
                        <div  class="card-header">
                            <h3>Manage Category</h3>
                        </div>
                        <div class="card-body">
                            <manage-category></manage-category>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import ManageCategory from './ManageCategory';

export default {
    name: 'category',
    components: {
        ManageCategory,
    }
};
</script>
