-- CREATE TABLES
CREATE TABLE tb_user (
    login       VARCHAR(20)  PRIMARY KEY,
    password    VARCHAR(100)    NOT NULL,
    nick        VARCHAR(20)     NOT NULL,
    birth_date  DATE            NOT NULL,
    prof_img    VARCHAR(200),
);

CREATE TABLE tb_post (
    id          SERIAL       PRIMARY KEY,
    author      VARCHAR(15)     NOT NULL,
    img_url     VARCHAR(80),
    title       VARCHAR(255)    NOT NULL,
    body        TEXT            NOT NULL,
    created_at  TIMESTAMP       NOT NULL DEFAULT NOW(),
);

CREATE TABLE tb_tags (
    tag         VARCHAR(20)     NOT NULL,
    post_id     INTEGER         NOT NULL,
    CONSTRAINT fk_post_id FOREIGN KEY (post_id) REFERENCES tb_post(id) ON DELETE CASCADE,
);


/*
-- FUNCTIONS E TRIGGERS
CREATE OR REPLACE FUNCTION delete_tags()
RETURNS TRIGGER AS $$
BEGIN
    DELETE FROM tb_tags WHERE post_id = OLD.id;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_delete_tags
BEFORE DELETE ON tb_post
FOR EACH ROW
EXECUTE FUNCTION delete_tags();
*/