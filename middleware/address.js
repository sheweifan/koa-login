export default ({ params, route, redirect }) => {
  const { path } = route
  const matchs = path.split('/')
  const isAdmin = (matchs[1] === 'admin' || matchs[1] === 'login')

  if (!params.address && !isAdmin && matchs.length <= 2) {
    return redirect('/nj')
  }
}
