module.exports = {
    eAdmin: function(req, res, next) {

        if(req.isAuthenticated() && req.user.eAdmin == 1){
            return next()
        }

        req.flash("error_msg", "Somente administradores entram aqui")
        res.redirect('/')
    },
    eUser: function(req, res, next) {

        if(req.isAuthenticated()){
            return next()
        }

        req.flash("error_msg", "Somente funcionarios registrados")
        res.redirect('/login')
    }
}