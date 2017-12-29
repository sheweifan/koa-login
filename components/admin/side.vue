<template lang="pug">
  el-menu(
    :router="true"
    :default-active="navActive"
  )
    template(
      v-for="(item, index) in nav"
    )
      el-menu-item(
        v-if="!item.child"
        :key="index"
        :index="item.path"
      )
        i(:class="'el-icon-' + item.icon")
        span {{ item.label }}
      el-submenu(
        v-else
        :key="index"
        :index="item.path"
      )
        template(slot="title")
          i(:class="'el-icon-' + item.icon")
          span {{ item.label }}
        el-menu-item(
          v-for="(citem, cindex) in item.child"
          :key="index + '-' + cindex"
          :index="citem.path"
        ) {{ citem.label }}
</template>

<script>
  const navConfig = [
    {
      label: '首页',
      path: '/admin',
      icon: 'menu'
    },
    {
      label: '内容管理',
      path: '1',
      icon: 'document',
      child: [
        {
          label: '首页',
          path: '/admin/doc'
        },
        {
          label: '设计大匠',
          path: '/admin/doc/designer'
        },
        {
          label: '效果图',
          path: '/admin/doc/map'
        },
        {
          label: '新闻中心',
          path: '/admin/doc/news'
        },
        {
          label: '加入我们',
          path: '/admin/doc/recruit'
        }
      ]
    },
    {
      label: '账号管理',
      path: '2',
      icon: 'setting'
    }
  ]
  export default {
    data () {
      return {
        nav: navConfig,
        navActive: this.$route.path
      }
    },
    created () {
    }
  }
</script>

<style scoped lang="stylus">
</style>
