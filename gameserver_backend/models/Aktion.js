/**
 * Created by kk on 04.12.16.
 */
const Aktion = {
    LINKSKNOPF: "LINKSKNOPF",
    RECHTSKNOPF: "RECHTSKNOPF",
    SCHUETTELN: "SCHUETTELN",
};

exports.getZufallsAktion = function () {
    var keys = Object.keys(Aktion)
    return Aktion[keys[ keys.length * Math.random() << 0]];
};