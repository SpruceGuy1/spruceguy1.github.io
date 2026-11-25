export var translator = {
    init:(t) => {
        var retval = {}
        for(let item in t){
            for(let lang in item){
                retval?.[lang]?.[item] = item[lang]
            }
        }
    }
}