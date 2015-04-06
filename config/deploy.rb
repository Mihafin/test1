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

# task :add_ssh_key do
#   run "if [ -f /projects/unfuddle_rsa ]; then ssh-add /projects/unfuddle_rsa; fi"
# end

# before "deploy", "add_ssh_key"