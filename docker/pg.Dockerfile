FROM postgres:17.4
RUN localedef -i C -c -f UTF-8 -A /usr/share/locale/locale.alias C
ENV LANG C
