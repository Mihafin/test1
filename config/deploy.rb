set :application, "test1"
set :repository,  "git@github.com:Mihafin/test1.git"

set :scm, :git
# Or: `accurev`, `bzr`, `cvs`, `darcs`, `git`, `mercurial`, `perforce`, `subversion` or `none`

role :web, "195.88.209.185"                          # Your HTTP server, Apache/etc
role :app, "195.88.209.185"                          # This may be the same as your `Web` server
# role :db,  "your primary db-server here", :primary => true # This is where Rails migrations will run
# role :db,  "your slave db-server here"

set :use_sudo, false
set :deploy_to, "/projects/cap/#{application}"
set :user, "mihail"
set :normalize_asset_timestamps, false
set :deploy_via, :remote_cache

# if you're still using the script/reaper helper you will need
# these http://github.com/rails/irs_process_scripts

# If you are using Passenger mod_rails uncomment this:
namespace :deploy do
  task :start do ; end
  task :stop do ; end
  task :restart do#, :roles => :app, :except => { :no_release => true } do
    # run "#{try_sudo} touch #{File.join(current_path,'tmp','restart.txt')}"
  end

  # [:start, :stop].each do |t|
  #   desc "#{t} task is a no-op with mod_rails"
  #   task t, :roles => :app do ; end
  # end
end

task :compile_flash do
  #compile and upload flash10 version as app.swf and don't update revision
  # compile_and_upload_flash 'deploy','Farm', ENV['locale'], 'app', nil,  false
  dir = File.expand_path(File.join(File.dirname(__FILE__), ".."))
  file = 'swf/src/sockettest.swf'
  cmd = "cd #{dir} && rm -f #{file} && /flex_sdk_4.6/bin/mxmlc -omit-trace-statements=false -output=#{file} -debug -static-link-runtime-shared-libraries=true swf/src/sockettest.as"
  p cmd
  system(cmd)

  upload_with_style(File.join(dir, file), "#{deploy_to}/current/#{file}")
end

def upload_with_style from , to
  # run("mkdir -p #{to[0..to.rindex('/')-1]}")
  upload(from, to+".new")
  run("mv -f #{to}.new #{to}")
end

task :restart_eye do
  run("sudo -iu mihail eye stop test")
  run("sudo -iu mihail eye quit")
  run("sudo -iu mihail eye load /projects/cap/test1/current/config/eye_cfg.rb")
  run("sudo -iu mihail eye start test")
end

# task :add_ssh_key do
#   run "if [ -f /projects/unfuddle_rsa ]; then ssh-add /projects/unfuddle_rsa; fi"
# end

# before "deploy", "add_ssh_key"
after "deploy", "restart_eye"
after "deploy", "compile_flash"