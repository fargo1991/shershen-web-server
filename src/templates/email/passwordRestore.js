module.exports = "<html>\n" +
  "<head>\n" +
  "    <meta charset=\"utf-8\"/>\n" +
  "    <style>\n" +
  "        body {\n" +
  "            font-family: Tahoma;\n" +
  "            margin-top: 0px;\n" +
  "            margin: 0px;\n" +
  "            padding: 100px;\n" +
  "        }\n" +
  "        hr {\n" +
  "            width : 350px;\n" +
  "            margin: auto;\n" +
  "            background-color: #f0f0f0;\n" +
  "            border: none;\n" +
  "            height: 1px;\n" +
  "            margin-top: 30px;\n" +
  "            margin-bottom: 10px;\n" +
  "        }\n" +
  "        .container {\n" +
  "            margin: auto;\n" +
  "            width: 500px;\n" +
  "            border: solid 1px #f0f0f0;\n" +
  "        }\n" +
  "        .header {\n" +
  "            background-color: #194561;\n" +
  "            color: white;\n" +
  "            width: auto;\n" +
  "            font-size: 24px;\n" +
  "            text-align: center;\n" +
  "            padding: 15px;\n" +
  "        }\n" +
  "        .header_description{\n" +
  "            font-size: 14px;\n" +
  "        }\n" +
  "        .msg {\n" +
  "            background-color: white;\n" +
  "            color: darkslategrey;\n" +
  "            font-size: 14px;\n" +
  "            text-align: center;\n" +
  "            width: auto;\n" +
  "            margin: 0px;\n" +
  "            padding: 15px;\n" +
  "            line-height: 2em;\n" +
  "        }\n" +
  "        .link_style {\n" +
  "            font-size: 18px;\n" +
  "            color: #194561;\n" +
  "        }\n" +
  "        .ps{\n" +
  "            font-size: 11px;\n" +
  "            width: 500px;\n" +
  "            margin: auto;\n" +
  "            text-indent: 15px;\n" +
  "        }\n" +
  "    </style>\n" +
  "</head>\n" +
  "<body>\n" +
  "<div class=\"container\">\n" +
  "    <div class=\"header\">\n" +
  "        ШЕРШЕНЬ\n" +
  "        <div class=\"header_description\">\n" +
  "            Восстановление доступа к учетной записи\n" +
  "        </div>\n" +
  "    </div>\n" +
  "    <p class=\"msg\">\n" +
  "        Уважаемый <span class=\"link_style\">{{username}}</span>! <br/>\n" +
  "        Для смены пароля перейдите по\n" +
  "        <a class=\"link_style\" href=\"http://localhost:1234/access/restore/mail?restore_token={{restore_token}}\">\n" +
  "            ссылке\n" +
  "        </a>\n" +
  "    </p>\n" +
  "</div>\n" +
  "\n" +
  "<hr/>\n" +
  "\n" +
  "<p class=\"ps\">\n" +
  "    * Это сообщение отправлено роботом. На него не нужно отвечать.\n" +
  "    Если вы не отправляли запрос на привязку почты в нашей системе, пожалуйста, просто проигнорируйте это письмо.\n" +
  "</p>\n" +
  "</body>\n" +
  "</html>"