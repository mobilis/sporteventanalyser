// Generated by CoffeeScript 1.6.2
(function() {
  var ANIM_FACTOR, BALL_SIZE, BARS_MAX_HEIGHT, BARS_MIN_HEIGHT, Ball3d, BallHTML, BallModel, CAM_ANIM_FACTOR, Drawable3d, Engine, FIELD_HEIGHT, FIELD_HEIGHT2, FIELD_WIDTH, FIELD_WIDTH2, Field3d, FieldHTML, FieldModel, HTMLView, Model, Moveable3d, MoveableModel, PI2, PLAYER_SIZE, PLAYER_SIZE2, Player3d, PlayerHTML, PlayerModel, SELECT_SIZE, add_player, ball, ball_3d, engine, establish_sea_connection, observed_player_a, observed_player_b, playerhtmls, playermodels, refresh_selection, replace_img_by_svg, run, running, t, team_a_observed, team_a_stats, team_b_stats, teams, tmp_counter, tmp_team_name, translation_dict, update_commentator, update_gamedata, update_heatmap, update_position, update_statistics,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  PI2 = Math.PI / 2;

  FIELD_WIDTH = 120;

  FIELD_WIDTH2 = FIELD_WIDTH / 2;

  FIELD_HEIGHT = 77;

  FIELD_HEIGHT2 = FIELD_HEIGHT / 2;

  BALL_SIZE = 2;

  PLAYER_SIZE = 4;

  PLAYER_SIZE2 = PLAYER_SIZE / 2;

  SELECT_SIZE = 5;

  ANIM_FACTOR = 300;

  CAM_ANIM_FACTOR = 3000;

  BARS_MAX_HEIGHT = 15;

  BARS_MIN_HEIGHT = 1;

  translation_dict = {
    "id": "Software ID",
    "ballContacts": "Ball contacts",
    "goalsScored": "Goals scored",
    "passesMade": "Passes made",
    "passesMissed": "Passes missed",
    "passesReceived": "Passes received",
    "tacklings": "Tacklings",
    "tacklesWon": "Tacklings won",
    "possessionTime": "Possession time",
    "totalDistance": "Total distance",
    "commentPred:Any": "Well..",
    "commentPred:shotOnGoal": "They might be going to shoot at the goal.",
    "commentPred:outOfPlay": "Out..! Probably.",
    "commentPred:turnOver": "Maybe they'll lose the ball."
  };

  t = function(word) {
    var res;

    res = translation_dict["" + word];
    if (res == null) {
      return "##" + word;
    }
    return res;
  };

  Model = (function() {
    function Model() {
      this.last_stats_update = 0;
      this.stats = {};
    }

    Model.prototype.update_stats = function(time, stats) {
      this.stats = stats;
      if (time != null) {
        return this.last_stats_update = time;
      }
    };

    Model.prototype.toString = function() {
      return this.constructor.name;
    };

    return Model;

  })();

  MoveableModel = (function(_super) {
    __extends(MoveableModel, _super);

    function MoveableModel() {
      MoveableModel.__super__.constructor.call(this);
      this.position = {
        x: 0,
        y: 0,
        z: 0
      };
      this.last_move_update = 0;
    }

    MoveableModel.prototype.update_position = function(time, data) {
      if (data.x != null) {
        this.position.x = data.x;
      }
      if (data.y != null) {
        this.position.y = data.y;
      }
      if (data.z != null) {
        this.position.z = data.z;
      }
      if (time != null) {
        return this.last_move_update = time;
      }
    };

    return MoveableModel;

  })(Model);

  FieldModel = (function(_super) {
    __extends(FieldModel, _super);

    function FieldModel(reality) {
      this.reality = reality;
      FieldModel.__super__.constructor.call(this);
      this.ratio = this.reality.width / this.reality.height;
    }

    return FieldModel;

  })(MoveableModel);

  BallModel = (function(_super) {
    __extends(BallModel, _super);

    function BallModel() {
      BallModel.__super__.constructor.call(this);
    }

    return BallModel;

  })(MoveableModel);

  PlayerModel = (function(_super) {
    __extends(PlayerModel, _super);

    function PlayerModel(id, name, team) {
      var selected;

      this.id = id;
      this.name = name;
      this.team = team;
      PlayerModel.__super__.constructor.call(this);
      selected = 2;
    }

    PlayerModel.prototype.update_stats = function(last_update, stats) {
      var res;

      this.last_update = last_update;
      res = this.stats;
      $.each(stats, function(k, v) {
        k = "" + k;
        if (k !== "id" && k !== "tacklings" && k !== "tacklesWon") {
          return res[k] = v;
        }
      });
      return this.stats = res;
    };

    PlayerModel.prototype.toString = function() {
      return "PlayerModel(" + string.Join(", ", [this.id, this.name, this.tricot_image]) + ")";
    };

    return PlayerModel;

  })(MoveableModel);

  Engine = (function() {
    function Engine(ball, resolution) {
      var now;

      this.ball = ball;
      this.resolution = resolution != null ? resolution : [640, 480];
      this.bgcolor = 0..fffff0;
      this.obj_stack = [];
      this.scene = new THREE.Scene;
      this.camera = new THREE.PerspectiveCamera(75, this.resolution[0] / this.resolution[1], 0.1, 10000);
      this.camera_mode = "BIRD";
      this.amb_light = new THREE.AmbientLight(0xffffff, 1.0);
      this.scene.add(this.amb_light);
      this.renderer = new THREE.WebGLRenderer;
      this.renderer.clearColor = this.bgcolor;
      this.renderer.clear;
      this.renderer.setSize(this.resolution[0], this.resolution[1]);
      now = new Date;
      this.start_time = now.getTime();
      this.add(this.ball);
      this.mean_ball_cnt = 30;
      this.mean_ball_pos = {
        x: 0,
        y: 0,
        z: 0
      };
      this.reality = {
        width: FIELD_WIDTH,
        height: FIELD_HEIGHT,
        offx: 0,
        offy: 0
      };
      this.field = null;
      this.players = [];
    }

    Engine.prototype.set_field = function(field) {
      this.field = field;
      this.reality = this.field.model.reality;
      return this.add(this.field);
    };

    Engine.prototype.reposition = function(position) {
      var result;

      result = {};
      if (this.field) {
        if (position.x) {
          result.y = (position.x - this.reality.height / 2) * this.field.height / this.reality.height;
        }
        if (position.y) {
          result.x = position.y * this.field.width / this.reality.width;
        }
        if (position.z) {
          result.z = position.z * (this.field.width / this.reality.width + this.field.height / this.reality.height) / 2;
        }
      }
      return result;
    };

    Engine.prototype.get_canvas = function(target_div) {
      return this.renderer.domElement;
    };

    Engine.prototype.add = function(obj) {
      var drawable, _i, _len, _ref, _results;

      this.obj_stack.push(obj);
      _ref = obj.drawables;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        drawable = _ref[_i];
        _results.push(this.scene.add(drawable));
      }
      return _results;
    };

    Engine.prototype.render = function() {
      var obj, time, _i, _j, _len, _len1, _ref, _ref1;

      time = (new Date).getTime() - this.start_time;
      this.mean_ball_pos.x = this.mean_ball_cnt * this.mean_ball_pos.x + this.ball.ball.position.x;
      this.mean_ball_pos.x /= this.mean_ball_cnt + 1;
      this.mean_ball_pos.y = this.mean_ball_cnt * this.mean_ball_pos.y + this.ball.ball.position.y;
      this.mean_ball_pos.y /= this.mean_ball_cnt + 1;
      this.mean_ball_pos.z = this.mean_ball_cnt * this.mean_ball_pos.z + this.ball.ball.position.z;
      this.mean_ball_pos.z /= this.mean_ball_cnt + 1;
      switch (this.camera_mode) {
        case "BIRD":
          this.camera.position.set(0, FIELD_WIDTH / 2, 0);
          this.camera.rotation.set(-Math.PI / 2, 0, 0);
          break;
        case "KEEPERA":
          this.camera.position.set(-FIELD_WIDTH / 2, 6, 0);
          this.camera.lookAt(this.mean_ball_pos);
          break;
        case "KEEPERB":
          this.camera.position.set(FIELD_WIDTH / 2, 6, 0);
          this.camera.lookAt(this.mean_ball_pos);
          break;
        default:
          this.camera.position.x = 5 * Math.cos(time / 1300);
          this.camera.position.y = FIELD_WIDTH / 3 + 5 * Math.sin(time / 700);
          this.camera.position.z = FIELD_WIDTH / 2 + 5 * Math.sin(time / 1900);
          this.camera.lookAt(this.mean_ball_pos);
      }
      _ref = this.obj_stack;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        obj = _ref[_i];
        obj.follow(this.camera, this.camera_mode === "BIRD");
      }
      _ref1 = this.obj_stack;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        obj = _ref1[_j];
        obj.animate(time);
      }
      return this.renderer.render(this.scene, this.camera);
    };

    return Engine;

  })();

  Drawable3d = (function() {
    function Drawable3d() {}

    Drawable3d.prototype.animate = function(time) {};

    Drawable3d.prototype.follow = function(target, reset) {
      var f, _i, _len, _ref, _results;

      if (reset == null) {
        reset = false;
      }
      _ref = this.followers;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        f = _ref[_i];
        _results.push((function(f) {
          if (reset) {
            return f.rotation.set(-PI2, 0, 0);
          } else {
            return f.lookAt(target.position);
          }
        })(f));
      }
      return _results;
    };

    Drawable3d.prototype.toString = function() {
      return this.constructor.name;
    };

    return Drawable3d;

  })();

  Moveable3d = (function(_super) {
    __extends(Moveable3d, _super);

    function Moveable3d() {
      Moveable3d.__super__.constructor.call(this);
    }

    Moveable3d.prototype.transition = function(factor, current, target) {
      return (current * factor + target) / (factor + 1);
    };

    return Moveable3d;

  })(Drawable3d);

  Field3d = (function(_super) {
    __extends(Field3d, _super);

    function Field3d(texturefile, model) {
      var geometry, mat_cfg, material;

      this.model = model;
      this.width = FIELD_WIDTH;
      this.height = FIELD_HEIGHT;
      geometry = new THREE.PlaneGeometry(this.width, this.height);
      mat_cfg = {
        map: new THREE.ImageUtils.loadTexture(texturefile),
        side: THREE.DoubleSide
      };
      material = new THREE.MeshLambertMaterial(mat_cfg);
      this.field = new THREE.Mesh(geometry, material);
      this.field.rotation.set(-PI2, 0, 0);
      this.drawables = [this.field];
      this.followers = [];
      Field3d.__super__.constructor.call(this);
    }

    return Field3d;

  })(Drawable3d);

  Ball3d = (function(_super) {
    __extends(Ball3d, _super);

    function Ball3d(texturefile, model) {
      var geometry, mat_cfg, material;

      this.model = model;
      Ball3d.__super__.constructor.call(this);
      geometry = new THREE.PlaneGeometry(BALL_SIZE, BALL_SIZE);
      mat_cfg = {
        map: new THREE.ImageUtils.loadTexture(texturefile),
        alphaTest: 0.5
      };
      material = new THREE.MeshBasicMaterial(mat_cfg);
      this.ball = new THREE.Mesh(geometry, material);
      geometry = new THREE.PlaneGeometry(1, 1);
      mat_cfg = {
        map: new THREE.ImageUtils.loadTexture("img/shadow.png"),
        transparent: true
      };
      material = new THREE.MeshBasicMaterial(mat_cfg);
      this.shadow = new THREE.Mesh(geometry, material);
      this.shadow.position.y = 0.001;
      this.shadow.rotation.set(-PI2, 0, 0);
      this.followers = [this.ball];
      this.drawables = [this.ball, this.shadow];
      this.ball.position.set(0, this.ball.geometry.height / 2, 0);
      this.last_anim_time = 0;
    }

    Ball3d.prototype.animate = function(time) {
      var dt, s_scale;

      dt = Math.max(1, time - this.last_anim_time);
      this.ball.position.x = this.transition(ANIM_FACTOR / dt, this.ball.position.x, this.model.position.x);
      this.ball.position.y = Math.max(this.ball.geometry.height / 2, this.transition(ANIM_FACTOR / dt, this.ball.position.y, 0.5 * this.ball.geometry.height + this.model.position.z));
      this.ball.position.z = this.transition(ANIM_FACTOR / dt, this.ball.position.z, this.model.position.y);
      this.shadow.position.x = this.ball.position.x;
      this.shadow.position.z = this.ball.position.z;
      s_scale = 1.0 + 1.0 * Math.max(1.0, this.ball.position.y);
      this.shadow.scale.set(s_scale, s_scale, s_scale);
      this.shadow.material.opacity = Math.min(1.0, Math.max(0.0, 1.0 / this.ball.position.y));
      return this.last_anim_time = time;
    };

    return Ball3d;

  })(Moveable3d);

  Player3d = (function(_super) {
    __extends(Player3d, _super);

    function Player3d(tricot_image, model) {
      var geometry, mat_cfg, material;

      this.model = model;
      Player3d.__super__.constructor.call(this);
      geometry = new THREE.PlaneGeometry(PLAYER_SIZE, PLAYER_SIZE);
      mat_cfg = {
        map: new THREE.ImageUtils.loadTexture(tricot_image),
        transparent: true
      };
      material = new THREE.MeshBasicMaterial(mat_cfg);
      this.shirt = new THREE.Mesh(geometry, material);
      this.shirt.position.set(0, PLAYER_SIZE2, 0);
      geometry = new THREE.PlaneGeometry(PLAYER_SIZE, PLAYER_SIZE);
      mat_cfg = {
        map: new THREE.ImageUtils.loadTexture("img/shadow.png"),
        opacity: 0.8,
        transparent: true
      };
      material = new THREE.MeshBasicMaterial(mat_cfg);
      this.shadow = new THREE.Mesh(geometry, material);
      this.shadow.position.y = 0.005;
      this.shadow.rotation.set(-PI2, 0, 0);
      geometry = new THREE.PlaneGeometry(SELECT_SIZE, SELECT_SIZE);
      mat_cfg = {
        map: new THREE.ImageUtils.loadTexture("img/selection.png"),
        transparent: true
      };
      material = new THREE.MeshBasicMaterial(mat_cfg);
      this.select = new THREE.Mesh(geometry, material);
      this.select.position.y = 0.005;
      this.select.rotation.set(-PI2, 0, 0);
      this.followers = [this.shirt];
      this.drawables = [this.shirt, this.shadow, this.select];
      this.last_anim_time = 0;
    }

    Player3d.prototype.animate = function(time) {
      var dt, s;

      dt = Math.max(1, time - this.last_anim_time);
      this.shirt.position.x = this.transition(ANIM_FACTOR / dt, this.shirt.position.x, this.model.position.x);
      this.shirt.position.z = this.transition(ANIM_FACTOR / dt, this.shirt.position.z, this.model.position.y);
      this.shadow.position.x = this.shirt.position.x;
      this.shadow.position.z = this.shirt.position.z;
      s = Math.max(1, this.shirt.position.y - PLAYER_SIZE2);
      this.shadow.scale.set(s, s, s);
      switch (this.model.selected) {
        case 2:
          this.select.material.opacity = 0.01;
          this.shirt.material.opacity = 1;
          break;
        case 1:
          s = 1 + 0.2 * Math.sin(0.005 * time);
          this.select.scale.set(s, s, s);
          this.select.rotation.z = 0.01 * time;
          this.select.position.x = this.shirt.position.x;
          this.select.position.z = this.shirt.position.z;
          this.select.material.opacity = 1.0;
          this.shirt.material.opacity = 1.0;
          break;
        default:
          this.select.material.opacity = 0;
          this.shirt.material.opacity = 0.5;
      }
      return this.last_anim_time = time;
    };

    Player3d.prototype.toString = function() {
      return "Player3d(" + string.Join(", ", [this.model]) + ")";
    };

    return Player3d;

  })(Moveable3d);

  HTMLView = (function() {
    function HTMLView(model) {
      this.model = model;
    }

    HTMLView.prototype.tbody = function() {
      var res;

      res = "<tbody>";
      $.each(this.model.stats, function(k, v) {
        return res += "<tr><td>" + t("" + k) + "</td><td>" + v + "</td></tr>\n";
      });
      return res + "</tbody>";
    };

    HTMLView.prototype.toString = function() {
      return this.constructor.name;
    };

    return HTMLView;

  })();

  FieldHTML = (function(_super) {
    __extends(FieldHTML, _super);

    function FieldHTML(model) {
      this.model = model;
      FieldHTML.__super__.constructor.call(this, this.model);
    }

    return FieldHTML;

  })(HTMLView);

  BallHTML = (function(_super) {
    __extends(BallHTML, _super);

    function BallHTML(model) {
      this.model = model;
      BallHTML.__super__.constructor.call(this, this.model);
    }

    return BallHTML;

  })(HTMLView);

  PlayerHTML = (function(_super) {
    __extends(PlayerHTML, _super);

    function PlayerHTML(model) {
      this.model = model;
      PlayerHTML.__super__.constructor.call(this, this.model);
    }

    PlayerHTML.prototype.tbody = function() {
      var res;

      res = "<tbody>";
      $.each(this.model.stats, function(k, v) {
        var minutes, seconds;

        k = "" + k;
        if (k !== "possessionTime") {
          return res += "<tr><td>" + t(k) + "</td><td>" + v + "</td></tr>\n";
        } else {
          seconds = v / 1000 / 1000 / 1000 / 1000;
          minutes = Math.floor(seconds / 60);
          seconds = Math.floor(seconds % 60);
          if (seconds < 10) {
            seconds = "0" + seconds;
          }
          return res += "<tr><td>" + t(k) + "</td><td>" + minutes + ":" + seconds + "</td></tr>\n";
        }
      });
      return res + "</tbody>";
    };

    PlayerHTML.prototype.toString = function() {
      return "Player(" + string.Join(", ", [this.id, this.name, this.tricot_image]) + ")";
    };

    return PlayerHTML;

  })(HTMLView);

  console.info("# SEA - sport event analyzer");

  console.info("## Initializing");

  running = false;

  ball = new BallModel();

  ball_3d = new Ball3d("img/ball.png", ball);

  engine = new Engine(ball_3d);

  playermodels = {};

  playerhtmls = {};

  tmp_team_name = "";

  tmp_counter = {
    "true": 0,
    "false": 0
  };

  teams = [];

  team_a_stats = {};

  team_b_stats = {};

  observed_player_a = null;

  observed_player_b = null;

  team_a_observed = false;

  console.info("* current local time is: " + Date.now());

  run = function() {
    requestAnimationFrame(run);
    return engine.render();
  };

  replace_img_by_svg = function() {
    console.info("* replace img by the svg within");
    return $("img").each(function() {
      var $img, imgclass, imgid, imgurl;

      $img = $(this);
      imgid = $img.attr("id");
      imgclass = $img.attr("class");
      imgurl = $img.attr("src");
      if (imgurl.substring(imgurl.length - 3) === "svg") {
        return $.get(imgurl, function(data) {
          var $svg;

          $svg = $(data).find("svg");
          if (imgid != null) {
            $svg = $svg.attr("id", imgid);
          }
          if (imgclass != null) {
            $svg = $svg.attr("class", imgclass);
          }
          $svg = $svg.removeAttr("xmlns:a");
          return $img.replaceWith($svg);
        });
      }
    });
  };

  refresh_selection = function(event, ui) {
    var a_plr, a_stats, all_plrs, b_plr, b_stats, plr_ids_a, plr_ids_b, plrhtml;

    all_plrs = [];
    plr_ids_a = [];
    plr_ids_b = [];
    $("#team_a").find("tbody").find("tr.ui-selected").each(function(i, t) {
      all_plrs.push(t.id);
      return plr_ids_a.push(t.id);
    });
    $("#team_b").find("tbody").find("tr.ui-selected").each(function(i, t) {
      all_plrs.push(t.id);
      return plr_ids_b.push(t.id);
    });
    a_stats = $("#player_a_stats");
    if (plr_ids_a.length) {
      observed_player_a = a_plr = playermodels[plr_ids_a[0]];
      a_stats.find(".player_name").text(a_plr != null ? a_plr.name : void 0);
      plrhtml = playerhtmls[a_plr.id];
      a_stats.find("tbody").replaceWith(plrhtml.tbody());
    } else {
      observed_player_a = null;
      a_stats.find(".player_name").text(teams[0]);
      a_stats.find("tbody").html("");
    }
    b_stats = $("#player_b_stats");
    if (plr_ids_b.length) {
      observed_player_b = b_plr = playermodels[plr_ids_b[0]];
      b_stats.find(".player_name").text(b_plr != null ? b_plr.name : void 0);
      plrhtml = playerhtmls[b_plr.id];
      b_stats.find("tbody").replaceWith(plrhtml.tbody());
    } else {
      observed_player_b = null;
      b_stats.find(".player_name").text(teams[1]);
      b_stats.find("tbody").html("");
    }
    if (all_plrs.length === 0) {
      return $.each(playermodels, function(k, v) {
        return v.selected = 2;
      });
    } else {
      return $.each(playermodels, function(k, v) {
        return v.selected = __indexOf.call(all_plrs, k) >= 0 ? 1 : 0;
      });
    }
  };

  add_player = function(v, i) {
    var color, plr, plr_3d, tableentry, team_a, team_b, tshirt;

    if (i === 0) {
      tmp_team_name = v.TeamName;
    }
    if (tmp_counter[v.TeamName === tmp_team_name] === 0) {
      teams.push(v.TeamName);
    }
    tmp_counter[v.TeamName === tmp_team_name] += 1;
    color = "rot";
    tableentry = '<tr id="' + v.PlayerID + '"><td>' + v.PlayerName + '</td><td class="smallinfo"></td></tr>';
    team_a = $("#team_a");
    team_b = $("#team_b");
    if (v.TeamName === tmp_team_name) {
      team_a.find("tbody").append(tableentry);
      $("body").find(".team_a_name").text(v.TeamName);
      color = "gelb";
    } else {
      team_b.find("tbody").append(tableentry);
      $("body").find(".team_b_name").text(v.TeamName);
    }
    tshirt = "img/trikot_" + color + "_" + tmp_counter[v.TeamName === tmp_team_name] + ".png";
    if (v.TeamName === tmp_team_name) {
      team_a.find("tr#" + v.PlayerID + " .smallinfo").append($("<img class=\"tshirt\" src=\"" + tshirt + "\"/>"));
    } else {
      team_b.find("tr#" + v.PlayerID + " .smallinfo").append($("<img class=\"tshirt\" src=\"" + tshirt + "\"/>"));
    }
    plr = new PlayerModel(v.PlayerID, v.PlayerName, v.TeamName);
    plr_3d = new Player3d(tshirt, plr);
    engine.add(plr_3d);
    engine.players.push(plr_3d);
    playermodels[v.PlayerID] = playermodels["" + v.PlayerID] = plr;
    return playerhtmls[v.PlayerID] = playerhtmls["" + v.PlayerID] = new PlayerHTML(plr);
  };

  update_position = function(item) {
    return item.positionNodes.forEach(function(v, i) {
      var data, _ref;

      switch (v.constructor.name) {
        case "BallPosition":
          data = {};
          if (v.positionX != null) {
            data.x = parseInt(v.positionX);
          }
          if (v.positionY != null) {
            data.y = parseInt(v.positionY);
          }
          if (v.positionZ != null) {
            data.z = parseInt(v.positionZ);
          }
          return ball.update_position(Date.now(), engine.reposition(data));
        case "PlayerPosition":
          data = {};
          if (v.positionX != null) {
            data.x = parseInt(v.positionX);
          }
          if (v.positionY != null) {
            data.y = parseInt(v.positionY);
          }
          return (_ref = playermodels[v.id]) != null ? _ref.update_position(Date.now(), engine.reposition(data)) : void 0;
        default:
          return console.warn("Unknown position update.", v);
      }
    });
  };

  update_statistics = function(item) {
    var _ref;

    return (_ref = item.playerStatistics) != null ? _ref.forEach(function(v, i) {
      var plrhtml, _ref1;

      switch (v.constructor.name) {
        case "PlayerStatistic":
          if ((_ref1 = playermodels[v.id]) != null) {
            _ref1.update_stats(Date.now(), v);
          }
          if (observed_player_a != null) {
            plrhtml = playerhtmls[observed_player_a.id];
            return $("#player_a_stats").find("tbody").replaceWith(plrhtml.tbody());
          } else if (observed_player_b != null) {
            plrhtml = playerhtmls[observed_player_b.id];
            return $("#player_b_stats").find("tbody").replaceWith(plrhtml.tbody());
          }
          break;
        default:
          return console.warn("Unknown Statistics", v);
      }
    }) : void 0;
  };

  update_commentator = function(v) {
    var commentator, data, max, probably, saying;

    switch (v.constructor.name) {
      case "CurrentPrognosisData":
        commentator = $("#attackprophet");
        saying = commentator.find(".says");
        data = v.attackResultPrediction;
        if (data != null) {
          max = 0.0;
          probably = "Any";
          $.each(data, function(k) {
            var d, height, top;

            d = parseFloat(data[k]);
            height = Math.floor(d * 0.01 * BARS_MAX_HEIGHT) + BARS_MIN_HEIGHT;
            top = BARS_MAX_HEIGHT + BARS_MIN_HEIGHT - height;
            commentator.find("#prob_" + k).animate({
              "height": height + "pt",
              "margin-top": top + "pt"
            }, 200);
            if (d > max) {
              max = d;
              return probably = k;
            }
          });
          probably = t("commentPred:" + probably);
          if (saying.html() !== probably) {
            saying.hide(0, function() {
              return saying.html(probably);
            }).fadeIn(200);
          }
        }
        commentator = $("#passprophet");
        saying = commentator.find(".says");
        data = v.passResultPrediction;
        if (data != null) {
          max = 0.0;
          probably = "Any";
          $.each(data, function(k) {
            var d, height, top;

            d = parseFloat(data[k]);
            height = Math.floor(d * 0.01 * BARS_MAX_HEIGHT) + BARS_MIN_HEIGHT;
            top = 0;
            commentator.find("#prob_" + k).animate({
              "height": height + "pt",
              "margin-top": top + "pt"
            }, 200);
            if (d > max) {
              max = d;
              return probably = k;
            }
          });
          probably = t("commentPred:" + probably);
          if (saying.html() !== probably) {
            return saying.hide(0, function() {
              return saying.html(probably);
            }).fadeIn(200);
          }
        } else {
          return console.log(v);
        }
        break;
      default:
        return console.warn("unknown type of prediction: ", v);
    }
  };

  update_gamedata = function(item) {
    return $.each(item.playingTimeInformation, function(k, v) {
      switch (k) {
        case "playingTime":
          return $("#content").find("#time").text(v.indexOf(':') < 2 ? "0" + v : v);
      }
    });
  };

  update_heatmap = function(item) {
    var map;

    if (observed_player_a || observed_player_b) {
      return console.log(item.playerHeatMaps);
    } else {
      map = $("#heatmap");
      return $.each(item.teamHeatMaps, function(k, heatmap) {
        if (heatmap.teamname === "GELB" && team_a_observed) {
          return $.each(eval(heatmap.map), function(y, array) {
            return $.each(array, function(x, val) {
              return map.find("#" + x + "_" + y).opacity(val);
            });
          });
        } else {
          return $.each(eval(heatmap.map), function(y, array) {
            return $.each(array, function(x, val) {
              return map.find("#" + x + "_" + y).css({
                "fill": "rgba(255,0,0," + val + ")",
                "stroke": "rgba(255,255,255,0.1)"
              });
            });
          });
        }
      });
    }
  };

  establish_sea_connection = function(onsuccess) {
    return sea.connect("seaclient@sea", "sea", "mobilis@sea", function() {
      sea.getGameMappings(function(mappings) {
        var field, field3d, gf, reality;

        console.info("* Setting up field");
        gf = mappings.GameFieldSize;
        reality = {
          height: gf.GameFieldMaxX - gf.GameFieldMinX,
          width: gf.GameFieldMaxY - gf.GameFieldMinY,
          offy: parseInt(gf.GameFieldMinX),
          offx: parseInt(gf.GameFieldMinY)
        };
        field = new FieldModel(reality);
        field3d = new Field3d("img/Fussballfeld.png", field);
        engine.set_field(field3d);
        console.info("* Setting up goal positions and size");
        console.info("* Setting up players");
        return mappings.PlayerMappings.forEach(add_player);
      });
      console.info("* adding pos handler");
      sea.pubsub.subscribeStatistic();
      sea.pubsub.addCurrentPositionDataHandler(update_position);
      sea.pubsub.addCurrentPlayerDataHandler(update_statistics);
      sea.pubsub.addCurrentTeamDataHandler(update_statistics);
      sea.pubsub.addCurrentHeatMapDataHandler(update_heatmap);
      sea.pubsub.addCurrentPrognosisDataHandler(update_commentator);
      sea.pubsub.addCurrentGameDataHandler(update_gamedata);
      return typeof onsuccess === "function" ? onsuccess() : void 0;
    });
  };

  $(function() {
    var b, _fn, _i, _len, _ref;

    $("#content").hide();
    $("#heatmap").hide();
    replace_img_by_svg();
    console.info("* preparing view buttons");
    $("#perspectives_menu").buttonset;
    _ref = $("#perspectives_menu").find("input");
    _fn = function(b) {
      switch (b.id) {
        case "HEAT_A":
          return b.onclick = function() {
            return $("#field").hide(0, function() {
              return $("#heatmap").show(0);
            });
          };
        case "HEAT_B":
          return b.onclick = function() {
            return $("#field").hide(0, function() {
              return $("#heatmap").show(0);
            });
          };
        default:
          return b.onclick = function() {
            engine.camera_mode = b.id;
            return $("#heatmap").hide(0, function() {
              return $("#field").show(0);
            });
          };
      }
    };
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      b = _ref[_i];
      _fn(b);
    }
    console.info("* adding canvas");
    $("#field").append(engine.get_canvas());
    console.info("* making selectables");
    $("#team_a, #team_b").selectable({
      filter: 'tr',
      selected: refresh_selection
    });
    return $("#startbutton").button().click(function(event) {
      $(this).html('<img src="img/spinner_animated.svg"/>');
      if (!running) {
        return establish_sea_connection(function() {
          running = true;
          $("#heatmap").hide();
          return $("#content").show().fadeIn("slow", function() {
            return $("#startbutton").fadeOut("fast", function() {
              return run();
            });
          });
        });
      }
    });
  });

}).call(this);
