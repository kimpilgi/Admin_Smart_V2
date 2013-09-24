<%
	Set objASPError = Server.GetLastError

    Response.Write "<span class='strong'>File : </span>" & objASPError.File & "<br><br>"
	Response.Write "<span class='strong'>Category : </span>" & objASPError.Category & "<br><br>"
    Response.Write "<span class='strong'>Description : </span>" & objASPError.Description & "<br><br>"
    Response.Write "<span class='strong'>Line : </span>" & objASPError.Line & " line." & "<br><br>"
%>