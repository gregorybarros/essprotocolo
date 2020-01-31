Categoria.find().then((categorias) => {const context = {
    usersDocuments: categorias.map(document => {
      return {
        nome: document.nome,
        slug: document.slug
      }
    })
  }
  // rendering usersDocuments from context Object
  res.render('admin/categorias', {
    usersDocuments: context.usersDocuments
  })
}).catch((err) => {
    req.flash("error_msg", "Houve um erro ao listar as categorias")
    res.redirect("/admin")
})