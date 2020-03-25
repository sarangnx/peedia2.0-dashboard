<template>
    <div class="container">
        <div class="row">
            <div class="col-md-12" v-for="(item, index) in category" :key="item.name">
                <div class="p-2">
                    <font-awesome-icon icon="caret-right" :transform="{ rotate: item.rotate || 0 }"/>
                    {{item.rotate || 0}}
                    <span class="pl-1 pointer" @click="toggle(index);">
                        {{ item.name }}
                    </span>
                </div>
                <div class="pl-4">
                    <div v-for="item2 in item.children" :key="item2.name">
                        <button class="btn btn-link">
                            {{ item2.name }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'manage-category',
    data: () => ({
        category: [
            {
                name: 'cat 1',
                level: 0,
                rotate: 0,
                children: [
                    {
                        name: 'sub cat1',
                        level: 1,
                    }
                ]
            },
            {
                name: 'cat 2',
                level: 0,
                children: [
                    {
                        name: 'sub cat1',
                        level: 1,
                    }
                ]
            },
            {
                name: 'cat 3',
                level: 0,
                children: [
                    {
                        name: 'sub cat1',
                        level: 1,
                    }
                ]
            },
        ]
    }),
    methods: {
        toggle(index) {
            if(this.category[index].rotate) {
                this.category[index].rotate = 0;
            } else {
                this.category[index].rotate = 90;
            }
        }
    }
}
</script>
<style scoped>
.pointer {
    color: #5e72e4;
    font-weight: bold;
}

.pointer:hover {
    color: #233dd2;
    cursor: pointer;
}
</style>
