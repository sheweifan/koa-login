<template lang="pug">
  el-select(
    v-model="value"
    placeholder="请选择"
    filterable
    remote
    :remote-method="search"
    :loading="loading"
    @change="emitValue"
    @focus="focus"
  )
    el-option(
      v-for="item in selects"
      :key="item._id"
      :label="item.name"
      :value="item._id"
    )
</template>

<script>
  import _map from 'lodash/map'
  export default {
    name: 'designer-selecter',
    props: {
      value: {
        type: Number
      },
      query: {
        type: Object,
        default: {}
      }
    },
    data () {
      return {
        selects: [],
        loading: false
      }
    },
    methods: {
      async _search () {
        this.loading = true
        let query = {
          ...(this.searchKey? {name: this.searchKey}: {}),
          ...this.query
        }
        const {list} = await this.$store.dispatch('getDesigner', {
          pageIndex: 1,
          query,
          keys: `
            _id,
            name
          `
        })
        this.selects = list
        this.loading = false
      },
      emitValue (e) {
        this.$emit('input', e)
      },
      search (name) {
        this.searchKey = name
        this._search()
      },
      focus () {
        this._search()
      }
    },
    watch: {
      async query () {
        this._search()
      }
    }
  }
</script>

<style scoped lang="stylus">
</style>
